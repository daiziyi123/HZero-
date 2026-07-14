import http from 'node:http';
import { getUserById } from './userProvider.js';

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/user/1') {
    const data = await getUserById(1);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(JSON.stringify(data));
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(3000, () => {
  console.log('Provider server: http://localhost:3000');
});
