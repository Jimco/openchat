var http = require('http')
  , io = require('socket.io')
  , chatNum = 0
  , responseData = {
    userid: '',
    username: '',
    content: '',
    time: ''
  }
  , disconnectData = {
    userid: '',
    username: '',
    time: ''
  };
   
var chatServer = http.createServer(function (request, response) {  
      response.writeHead(250, { 'Content-Type': 'text/html' });  
      response.end('WebSocket server is running');  
  }).listen(2222);
   
var chatSocket = io.listen(chatServer).set('log', 1);  
   
chatSocket.on('connection', function (client) {
  chatNum++;
  client.on('chatMessage', function (data) {  
    console.log('Client Custom Message: ', data);  
    var current = new Date().getTime();
    client.broadcast.emit('chatResponse', data + ' (Date: '+ current +')');
  });

  client.on('disconnect', function(){
    chatNum--;
    console.log('Client disconnected');
    client.broadcast.emit('chatResponse', data + ' (Date: '+ current +')');
  });

}); 