import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import apiRouter from "./src/server/routes";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000");

  // Production security headers scaffolding
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
  });

  // Body Parsing Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // REST API Mount Point
  app.use("/api", apiRouter);

  // Health probe & system verification endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      version: "0.6.0",
      release: "Artora Production Backend",
      timestamp: new Date().toISOString()
    });
  });

  // Vite static assets & SPA fallback handler
  if (process.env.NODE_ENV !== "production") {
    console.log("⚙️  Starting Artora in dynamic development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Starting Artora in optimized production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`====================================`);
    console.log(`ARTORA PRODUCTION BACKEND BINDINGS`);
    console.log(`STATUS: Operational`);
    console.log(`PORT: ${PORT}`);
    console.log(`HOST: 0.0.0.0`);
    console.log(`DATABASE FALLBACK MODE: Activated`);
    console.log(`====================================`);
  });
}

startServer().catch((err) => {
  console.error("🔴 Server start failed:", err);
  process.exit(1);
});
