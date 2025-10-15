import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./server/index.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Check if this is a request for a static asset
      const url = new URL(request.url);

      // Let Cloudflare Pages handle static assets from /build/
      if (url.pathname.startsWith("/build/")) {
        return env.ASSETS.fetch(request);
      }

      // Create request handler with proper context
      const handleRequest = createRequestHandler({
        build,
        mode: "production",
        getLoadContext: () => ({
          env,
          ctx,
          cf: request.cf,
        }),
      });

      // Handle all other requests with Remix
      return await handleRequest(request);
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(`Internal Server Error: ${error.message}\n\nStack: ${error.stack}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  },
};
