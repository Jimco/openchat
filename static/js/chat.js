$(function($){

  // var content = $('#content');
  // var status = $('#status');
  // var input = $('#input');
  // var myName = false;
  var $msgBox = $('.message')
    , $chatBox = $('.chatBox')
    , username = null;

  // 建立websocket连接
  socket = io.connect('http://localhost:3000');
  // 收到server的连接确认
  socket.on('open', function(){
    $msgBox.append('<div class="msg info">请输入用户名...</div>')
  });

  // 监听system事件，判断welcome或者disconnect，打印系统消息信息
  socket.on('system', function(json){
    var p = '';
    if(json.type === 'welcome'){
      if(username == json.text) status.text(username + ': ').css('color', json.color);
      // p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Welcome ' + json.text +'</p>';
      p = '<div class="msg info">System  @ '+ json.time +' : Welcome '+ json.text +'</div>';
    }
    else if(json.type == 'disconnect'){
      // p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Bye ' + json.text +'</p>';
      p = '<div class="msg info">System  @ '+ json.time +' : Bye '+ json.text +'</div>';
    }

    $msgBox.append(p);
  });

  //监听message事件，打印消息信息
  socket.on('message', function(json){
    // var p = '<p><span style="color:'+json.color+';">' + json.author+'</span> @ '+ json.time+ ' : '+json.text+'</p>';
    var p = '<div class="chatinfo"><span style="color:'+json.color+';">' + json.author +'</span>  @ '+ json.time +' : '+ json.text +'</div>';
    $msgBox.append(p);
  });

  $('.nickbtn').on('click', function(e){
    var nickname = $('.nickinput').val();
    socket.send(nickname);
    $('.userinfo').html('<p>'+ nickname +'</p>');
  });

  $('.submit').on('click', function(e){
    // if(!username) return false;
    var msg = $chatBox.val();
    socket.send(msg);
    $chatBox.val('');
  });

});

  