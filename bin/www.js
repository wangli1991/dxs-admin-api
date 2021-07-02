/*
 * @Author: WangLi
 * @Date: 2021-04-12 11:20:36
 * @LastEditors: WangLi
 * @LastEditTime: 2021-06-17 08:17:01
 */
const app = require("../app");
const debug = require("debug")("niuexpress:server");
const http = require("http");
const https = require("https");
const fs = require("fs");
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "8086");
app.set("port", port);

/**
 *  密钥文件
 */
const httpsOption = {
  key: fs.readFileSync("./bin/ssl/cert.key"),
  cert: fs.readFileSync("./bin/ssl/cert.pem"),
};

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const servers = https.createServer(httpsOption, app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

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

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
