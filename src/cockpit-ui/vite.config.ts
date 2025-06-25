import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vscodeWebviewHmr from 'vite-plugin-vscode-webview-hmr';
import path from 'path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [vue(), vscodeWebviewHmr()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __IS_WEBVIEW_PROD__: JSON.stringify(!isDev),
      'process.env.VITE_DEV_SERVER_URL': JSON.stringify(
        isDev ? 'http://localhost:5000' : ''
      ),
    },
    server: {
      host: 'localhost',
      port: 5000,
    },
    build: {
      outDir: 'build',
      target: 'es2018',
      minify: 'terser',
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
          manualChunks: undefined,
        },
        external: [],
      },
      assetsInlineLimit: 4096,
    },
    base: './',
  };
});
