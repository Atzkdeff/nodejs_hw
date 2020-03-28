require('dotenv').config();

/**
 * Module dependencies.
 */
import { app } from '../app';
import http from 'http';
import debug from 'debug';
import { AddressInfo } from 'net';
import 'reflect-metadata';

const serverDebug = debug('nodejs-hw:server');

debug.enable('nodejs-hw:server');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.SERVER_PORT || '3000');
app.set('port', port);

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

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
    const normalizedPort = parseInt(val, 10);

    if (isNaN(normalizedPort)) {
        // named pipe
        return val;
    }

    if (normalizedPort >= 0) {
        // port number
        return normalizedPort;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
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
    const addr: AddressInfo | string | null = server.address();
    let bind: string = '';

    if (!!addr) {
        bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    }
    serverDebug('Listening on ' + bind);
}
