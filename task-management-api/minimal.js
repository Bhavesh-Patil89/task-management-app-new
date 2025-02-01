const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Test server is running\n');
});

server.listen(8080, () => {
    console.log('Test server running on port 8080');
});
