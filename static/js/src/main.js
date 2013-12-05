/**
 * openchat - 0.1.1
 * Email: xjiancong@gmail.com
 * Date: 2013-12-04
 */
define(function(require, exports, module){
  var util = require('./util')
    , placeholderPlugin = require('./jquery_placeholder')
    , socket = require('/socket.io/socket.io')
    , $msgBox = $('.message')
    , $chatBox = $('.chatArea')
    , from = util.getCookie('chat_user')
    , to = 'all';

  socket = io.connect();

  // placeholder 兼容插件调用
  $('input[placeholder], textarea[placeholder]').placeholder();

  socket.emit('online', {user: from});
  socket.on('online', function(data){
    var syshtml;
    // 上线消息
    if(data.user !== from){
      syshtml = '<div class="info-tip">System ('+ now() +'): 用户 '+ data.user +' 上线了！</div>';
    }
    else{
      syshtml = '<div class="info-tip">System ('+ now() +'): 欢迎进入聊天室！</div>';
    }

    $msgBox.append(syshtml);
    flushUsers(data.users);
    showSayTo();
  });

  socket.on('say', function(data){
    var sayhtml;
    if(data.to === 'all'){
      sayhtml = '<div class="chatinfo">'+ data.from +' ('+ now() +') 对 所有人 说: <br/>'+ data.msg +'</div>';
    }
    else if(data.to == from){
      sayhtml = '<div class="chatinfo" style="color:#00f;">'+ data.from +' ('+ now() +') 对 你 说: <br/>'+ data.msg +'</div>';
    }
    $msgBox.append(sayhtml);
  });

  socket.on('offline', function(data){
    var syshtml = '<div class="info-tip">System ('+ now() +'): 用户 '+ data.user +' 下线了！</div>';

    $msgBox.append(syshtml);
    flushUsers(data.users);
    if(data.user === to) to = 'all';
    showSayTo();
  });

  socket.on('disconnect', function(data){
    var syshtml = '<div class="info-tip">System ('+ now() +'): 连接服务器失败！</div>';
    $msgBox.append(syshtml);
    $('.list ul').html('');
  });

  socket.on('reconnect', function(data){
    var syshtml = '<div class="info-tip">System ('+ now() +'): 重新连接服务器！</div>';
    $msgBox.append(syshtml);
    socket.emit('online', {user: from});
  });


  // 刷新用户在线列表
  function flushUsers(users) {
    var $list = $('.list')
      , count = 0;
    //清空之前用户列表，添加 "所有人" 选项并默认为灰色选中效果
    $list.find('ul').html('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
    //遍历生成用户在线列表
    for (var i in users) {
      $list.find('ul').append('<li alt="' + users[i] + '" title="双击聊天" onselectstart="return false">' + users[i] + '</li>');
      count++;
    }
    $list.find('.online').text(count);
    //双击对某人聊天
    $list.on('dblclick', 'li', function() {
      //如果不是双击的自己的名字
      if ($(this).attr('alt') != from) {
        //设置被双击的用户为说话对象
        to = $(this).attr('alt');
        //清除之前的选中效果
        $(".list ul > li").removeClass('sayingto');
        //给被双击的用户添加选中效果
        $(this).addClass('sayingto');
        //刷新正在对谁说话
        showSayTo();
      }
    });
  }

  // 显示正在对谁说话
  function showSayTo() {
    $("#from").html(from);
    $("#to").html(to == "all" ? "所有人" : to);
  }

  // 获取当前时间
  function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }


  // 发言
  $('.submit').on('click', function(e){
    var content = $chatBox.val()
      , sayhtml;

    if(!content) return;
    if(to === 'all'){
      sayhtml = '<div class="chatinfo">你 ('+ now() +') 对 所有人 说: <br/>'+ content +'</div>';
    }
    else{
      sayhtml = '<div class="chatinfo" style="color:#00f;">你 ('+ now() +') 对 '+ to +' 说: <br/>'+ content +'</div>';
    }

    $msgBox.append(sayhtml);

    socket.emit('say', {from: from, to: to, msg: content});
    $chatBox.val('').focus();
  });


});
