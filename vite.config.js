import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Runs the same /api handler inside `npm run dev`, so no Vercel CLI is needed locally.
function devApi(env) {
  return {
    name: "dev-api",
    configureServer(server) {
      Object.assign(process.env, env);
      server.middlewares.use("/api/news", async (req, res) => {
        const { default: handler } = await server.ssrLoadModule("/api/news.js");
        req.url = "/api/news" + (req.url.startsWith("?") ? req.url : req.url.replace(/^\/?/, "/").replace(/^\/$/, ""));
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), devApi(loadEnv(mode, process.cwd(), ""))],
}));
