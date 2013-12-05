//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , util = require('./server/util')
  , userid = 0;

//设置日志级别
io.set('log level', 1);

//WebSocket连接监听
io.on('connection', function (socket) {
  
  socket.emit('open'); 

  // console.log(socket.handshake);

  // 构造客户端对象
  var clientinfo = { clientid: socket.id, userid: userid++, colortag: util.randomColor() };

  // 对message事件的监听
  socket.on('message', function(data){
    console.log(data);
    try{
      data = JSON.parse(data);
    }
    catch(error){
      console.log('Error: ' + error);
    }

    data = util.mix(clientinfo, data);
    data.time = util.getTime();

    console.log(data.type);
    switch(data.type){
      case 'login':
        if(data.username){
          socket.emit(data.type, data);
          socket.broadcast.emit('system', data);
        }
        else{
          socket.emit('system', { type: data.type, msg: '用户名不能为空'});
        }
      break;

      case 'speak':
        if(data.content){
          socket.emit(data.type, data);
          socket.broadcast.emit(data.type, data);
        }
        else{
          socket.emit('system', {type: data.type, msg: '内容不能为空'});
        }
      break;
    }

  });

  //监听出退事件
  socket.on('disconnect', function(){
    if(!clientinfo.username) return;
    clientinfo.type = 'logout';
    clientinfo.time = util.getTime();
    // 广播用户已退出
    socket.broadcast.emit('system', clientinfo);
    console.log(clientinfo.username + ' Disconnect');
  });

});

//express基本配置
app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// 指定webscoket的客户端的html文件
app.get('/', function(req, res){
  res.sendfile('views/chat.html');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
