const http = require('http');
const debug = require('debug')('trendy');
const app = require('./app');
const port = process.env.PORT || '8080';

app.set('port', port);

const server = http.createServer(app);

server.listen(port);