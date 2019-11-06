'use strict';

const express = require('express');
const http = require('http');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
/*
const app = express();
app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.send('Hello world\n');
});

app.listen(PORT, HOST);
*/

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/HTML' });
    res.end('<!DOCTYPE html>\n<h1>Hello, world!</h1>');
}).listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`);