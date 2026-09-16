import { defineConfig, loadEnv } from 'vite';
import { handleDevOpsChatApi } from './api/chat.js';

export default defineConfig(({ mode }) => {
  // Load env variables from .env / .env.local without exposing them to the client
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      {
        name: 'devops-chat-api-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url || '';
            if (rawUrl === '/api/chat' || rawUrl.startsWith('/api/chat/') || rawUrl.startsWith('/api/chat?')) {
              handleDevOpsChatApi(req, res, env);
              return;
            }
            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url || '';
            if (rawUrl === '/api/chat' || rawUrl.startsWith('/api/chat/') || rawUrl.startsWith('/api/chat?')) {
              handleDevOpsChatApi(req, res, env);
              return;
            }
            next();
          });
        }
      }
    ],
    server: {
      port: 5173
    },
    preview: {
      port: 4173
    }
  };
});
