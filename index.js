//引入程序包
var express = require('express')
  , path = require('path')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , util = require('./server/util')
  , users = {};

//设置日志级别
io.set('log level', 1);

io.on('connection', function (socket) {
  
  // 监听上线
  socket.on('online', function(data){
    socket.name = data.user;
    if(!users[data.user]) users[data.user] = data.user;

    io.sockets.emit('online', {users: users, user: data.user}); // 向所有用户广播消息
  });

  // 监听发言
  socket.on('say', function(data){
    if(data.to === 'all'){
      socket.broadcast.emit('say', data); // 向其他所有用户广播消息
    }
    else{
      var clients = io.sockets.clients(); // 向特定用户广播消息，clients 为存储所有连接对象的数组

      clients.forEach(function(client){
        if(client.name === data.to){
          client.emit('say', data);
        }
      });
    }
  });

  // 监听下线
  socket.on('disconnect', function(data){
    if(users[socket.name]){
      delete users[socket.name];
      socket.broadcast.emit('offline', {users: users, user: socket.name});
    }
  });
  
});

//express基本配置
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  if (req.cookies.chat_user == null) {
    res.redirect('/login');
  } else {
    res.sendfile('views/chat.html');
  }
});

app.get('/login', function(req, res){
  res.sendfile('views/login.html');
});

app.post('/login', function(req, res){
  if(users[req.body.name]){
    //存在，则不允许登陆
    res.redirect('/login');
  } 
  else{
    //不存在，把用户名存入 cookie 并跳转到主页
    res.cookie('chat_user', req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
