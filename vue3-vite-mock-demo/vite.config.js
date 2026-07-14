import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const userList = [
  { id: 1, name: '张三', age: 24, role: '前端开发', status: 'online' },
  { id: 2, name: '李四', age: 26, role: '后端开发', status: 'offline' },
  { id: 3, name: '王五', age: 25, role: '测试工程师', status: 'online' },
  { id: 4, name: '赵六', age: 27, role: '产品经理', status: 'busy' },
];

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'local-mock-api',
      configureServer(server) {
        server.middlewares.use('/api/users', (req, res) => {
          const url = new URL(req.url || '', 'http://localhost');
          const keyword = url.searchParams.get('keyword') || '';

          const data = userList.filter(user =>
            user.name.includes(keyword) || user.role.includes(keyword)
          );

          res.setHeader('Content-Type', 'application/json;charset=utf-8');
          res.end(
            JSON.stringify({
              code: 200,
              message: 'success',
              data,
            })
          );
        });
      },
    },
  ],
});
