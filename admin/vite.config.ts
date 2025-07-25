import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    define: {
      'import.meta.env.ADMIN_USER': JSON.stringify(env.ADMIN_USER),
      'import.meta.env.ADMIN_PASS': JSON.stringify(env.ADMIN_PASS),
    },
  };
});
