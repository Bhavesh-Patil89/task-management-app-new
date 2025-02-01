const http = require('http');
const url = require('url');

let tasks = [];

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    
    if (req.method === 'GET' && parsedUrl.pathname === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }
    else if (req.method === 'POST' && parsedUrl.pathname === '/tasks') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const task = JSON.parse(body);
            task.id = Date.now().toString();
            tasks.push(task);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(task));
        });
    }
    else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/tasks/')) {
        const id = parsedUrl.pathname.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedTask = JSON.parse(body);
            const index = tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...updatedTask };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tasks[index]));
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    }
    else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/tasks/')) {
        const id = parsedUrl.pathname.split('/')[2];
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3333;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});
