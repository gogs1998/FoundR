import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";

import "./tailwind.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  // Safely handle Clerk auth - may not be configured
  let userId = null;
  try {
    const auth = await getAuth(request);
    userId = auth?.userId || null;
  } catch (error) {
    console.warn("Clerk authentication not configured:", error);
  }

  // @ts-ignore - context.env is provided by Cloudflare Pages
  const env = context?.env || {};

  return {
    userId,
    ENV: {
      CLERK_PUBLISHABLE_KEY: env.CLERK_PUBLISHABLE_KEY || "",
      STRIPE_PUBLISHABLE_KEY: env.STRIPE_PUBLISHABLE_KEY || "",
    },
  };
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oops!</title>
          <Meta />
          <Links />
        </head>
        <body className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
            <h1 className="text-6xl font-bold text-white mb-4">
              {error.status}
            </h1>
            <p className="text-2xl text-purple-300 mb-6">
              {error.statusText}
            </p>
            {error.data && (
              <p className="text-gray-400 mb-8">
                {error.data}
              </p>
            )}
            <a
              href="/"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all hover:scale-105"
            >
              Go Home
            </a>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-400 mb-8">
            An unexpected error occurred. Please try again.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition-all hover:scale-105"
          >
            Go Home
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
