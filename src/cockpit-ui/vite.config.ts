import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import pluginVscode from '@tomjs/vite-plugin-vscode';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag: string) => tag.startsWith('vscode-'),
          },
        },
      }),
      pluginVscode({
        recommended: false,
        extension: { entry: '../extension.ts' },
        webview: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __IS_WEBVIEW_PROD__: JSON.stringify(!isDev),
      'process.env.VITE_DEV_SERVER_URL': JSON.stringify(
        isDev ? 'http://localhost:5000' : undefined
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
