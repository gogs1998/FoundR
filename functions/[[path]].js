import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore
import * as build from "../build/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => {
    return {
      env: context.env,
    };
  },
});
