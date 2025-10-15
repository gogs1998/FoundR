import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import "./tailwind.css";
export const links = () => [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];
export async function loader(args) {
    const { request } = args;
    const { userId } = await getAuth(args);
    return {
        userId,
        ENV: {
            CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
            STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        },
    };
}
export default function App() {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { children: [_jsx(Outlet, {}), _jsx(ScrollRestoration, {}), _jsx(Scripts, {}), _jsx(LiveReload, {})] })] }));
}
