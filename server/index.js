var http = require('http')
  , io = require('socket.io');  
   
var chatServer = http.createServer(function (request, response) {  
      response.writeHead(250, { 'Content-Type': 'text/html' });  
      response.end('WebSocket server is running');  
  }).listen(2222);
   
var chatSocket = io.listen(chatServer).set('log', 1);  
   
chatSocket.on('connection', function (client) {

  client.on('chatMessage', function (data) {  
    console.log('Client Custom Message: ', data);  
    var current = new Date().getTime();
    client.broadcast.emit('chatResponse', data + ' (Date: '+ current +')');
  });

  client.on('disconnect', function(){
    console.log('Client disconnected');
  });

}); 