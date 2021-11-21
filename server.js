const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'frontend')));

server.listen(8000, () => {
    console.log('listening on *:8000');
});
