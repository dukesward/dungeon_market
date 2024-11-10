import express, { Express, Request, Response } from "express";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import path from "path";
import http from "http";

const app: Express = express();
const port = process.env.PORT || '3000';
const env = 'dev';

const appRouter = require('./routes/main');

app.use(logger(env));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/*', appRouter);

app.use((req: Request, res: Response, next) => {
  next(createHttpError(404));
});

app.set('port', normalizePort(port));

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      //process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      //process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + (addr ? addr.port : '?');
  console.log('Listening on ' + bind);
}

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);