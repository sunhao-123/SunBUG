const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const compression = require('compression')
const frameguard = require('frameguard')

let http = require("http");
let fs = require("fs");

//App实例
var app = express();

let port = 11233;

let server = http.createServer(app)
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
// https.createServer(httpsOption, app).listen(12580);

// var server = http.createServer(function (req, res) {
//   res.writeHead(301, { 'Location': 'https://www.sun0623.top:12580' });
//   res.end();
// });

// server.listen(80)
//中间件设置
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// Don't allow me to be in ANY frames:
app.use(frameguard({ action: 'deny' }))

app.use(helmet());
app.use(
  helmet.hsts({
    maxAge: 63072000,
    preload: true,
  })
);

//允许跨域
app.use((req, res, next) => {
  res.header({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  });
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

function onError(error) {
  if (error.syscall !== 'listen') {
    setTimeout(function () {
      server.listen(port);
    }, 5000)
    return
    // throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // console.error(bind + ' requires elevated privileges');
      console.log(bind + ' requires elevated privileges')
      setTimeout(function () {
        server.listen(port);
      }, 5000)
      return
    // process.exit(1);
    // break;
    case 'EADDRINUSE':
      // console.error(bind + ' is already in use');
      consolelog(bind + ' is already in use')
      setTimeout(function () {
        server.listen(port);
      }, 5000)
      return
    // process.exit(1);
    // break;
    default:
      console.log(error)
      setTimeout(function () {
        server.listen(port);
      }, 5000)
      return
    // throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  // console.log(`${port}端口已开放！`)
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}



//热歌榜定时器
require("./Component/scheduleGetHot")
//热歌榜定时器
// require("./Component/message")

//设置session
app.use(require("./session/index"));

//设置路由
app.use('/', require('./routers/index'));


module.exports = app;
