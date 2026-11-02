import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from "rollup-plugin-visualizer";

const BOOTSTRAP_SCRIPT = "/api/config/client/bootstrap.js";

/**
 * 前后端分离部署（如 EdgeOne Pages 托管前端）时，把 index.html 中的
 * 引导脚本指向远端 API 域名。同源部署时保持原样。
 */
function apiBasePlugin(apiBase: string): Plugin {
  return {
    name: "rin-api-base",
    transformIndexHtml(html) {
      if (!apiBase) return html;
      return html.replace(BOOTSTRAP_SCRIPT, `${apiBase}${BOOTSTRAP_SCRIPT}`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = (env.VITE_API_BASE || '').trim().replace(/\/+$/, '');
  const serverPort = Number(process.env.RIN_SERVER_PORT || "11499");
  const serverTarget = `http://127.0.0.1:${serverPort}`;
  const cacheDir = process.env.RIN_VITE_CACHE_DIR || "../.vite/client";
  
  return {
    cacheDir,
    // Note: Client configuration is fetched from server at runtime
    build: {
      outDir: '../dist/client',
      emptyOutDir: true,
    },
    plugins: [
      apiBasePlugin(apiBase),
      react(),
      // Only open visualizer in build mode
      visualizer({ open: !isDev })
    ],
    server: {
      proxy: {
        "/api": {
          target: serverTarget,
          changeOrigin: false,
        },
        "/rss.xml": {
          target: serverTarget,
          changeOrigin: false,
        },
        "/atom.xml": {
          target: serverTarget,
          changeOrigin: false,
        },
        "/rss.json": {
          target: serverTarget,
          changeOrigin: false,
        },
        "/feed.json": {
          target: serverTarget,
          changeOrigin: false,
        },
        "/feed.xml": {
          target: serverTarget,
          changeOrigin: false,
        },
      },
    },
  }
})
