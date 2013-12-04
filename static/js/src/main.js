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
    , username = null;

  socket = io.connect('http://localhost:3000');

  // placeholder 兼容插件调用
  $('input[placeholder], textarea[placeholder]').placeholder();

  // 收到server的连接确认
  socket.on('open', function(){
    var userinfo = util.getCookie('chat_user');
    if(userinfo.username){
      socket.send(util.JSONstringify({ type: 'login',  username: userinfo.username }));
    }
    $msgBox.append('<div class="info-tip">[ 服务启动，请输入昵称发言 ]</div>')
  });

  // 登录
  socket.on('login', function(data){
    console.log(data, 'logined...');

    $('.userinfo').html('<span>'+ data.username +'</span>');
    $('.chatBox').show();

    systemTip('login', data);
    util.setCookit('chat_user', encodeURIComponent(JSON.stringify(data)), 7);

    // 登陆后才可以发言
    socket.on('speak', function(data){
      console.log(data, 'speaking...');
      var msghtml = '<div class="chatinfo"><span style="color:'+ data.colortag +';">' + data.username +'</span>  @ '+ data.time +' : '+ data.content +'</div>';
      $msgBox.append(msghtml);
    });

  });


  // 系统消息
  socket.on('system', function(data){
    console.log(data);
    systemTip(data.type, data);
  });


  $('.nickbtn').on('click', function(e){
    var nickname = $('.nickinput').val()
      , data = util.JSONstringify({ type: 'login',  username: nickname });
    socket.send(data);
    
  });

  $('.submit').on('click', function(e){
    var content = $chatBox.val()
      , data = util.JSONstringify({ type: 'speak',  content: content });
    socket.send(data);
    $chatBox.val('');
  });


  function systemTip(type, data){
    var $msgBox = $('.message')
      , msghtml;
    switch(type){
      case 'login':
        msghtml = '<div class="info-tip">[ Welcome '+ data.username +' ('+ data.time +') ]</div>';
      break;

      case 'logout':
        msghtml = '<div class="info-tip">[ Bye '+ data.username +' ('+ data.time +') ]</div>';
      break;

      case 'tip':
        msghtml = '<div class="info-tip">[ '+ data.msg +' ('+ data.time +') ]</div>';
      break;
    }

    $msgBox.append(msghtml);
  }


});
