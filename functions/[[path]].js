import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore - this is the Remix server build
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({
    env: context.env,
    cf: context.request.cf,
  }),
});

export function onRequest(context) {
  return handleRequest(context);
}
