var http = require('http')
  , io = require('socket.io');  
   
var chatServer = http.createServer(function (request, response) {  
    response.writeHead(250, { 'Content-Type': 'text/html' });  
    response.end('Your WebSocket server is running');  
}).listen(2222);
   
var chatSocket = io.listen(chatServer).set('log', 1);  
   
chatSocket.on('connection', function (client) {
    client.on('YourcustomMessage', function (data) {  
      console.log('Client Custom Message: ', data);  
      var current = new Date().getTime();  
      client.broadcast.emit('YourMessageResponse', data + '(broadcasted)->' + current);  
    });
    client.on('disconnect', function () {  
      console.log('Your Client disconnected');  
    });  
}); 