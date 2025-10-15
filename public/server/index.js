var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.cloudflare.tsx
var entry_server_cloudflare_exports = {};
__export(entry_server_cloudflare_exports, {
  default: () => handleRequest
});
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let body = await renderToReadableStream(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
    {
      // If you wish to abort the rendering process, you can pass a signal here.
      // Please refer to the templates for example son how to configure this.
      // signal: controller.signal,
      onError(error) {
        console.error(error), responseStatusCode = 500;
      }
    }
  );
  return isBotRequest(request.headers.get("user-agent")) && await body.allReady, responseHeaders.set("Content-Type", "text/html"), new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}

// app/root.js
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader
});
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

// css-bundle-plugin-ns:@remix-run/css-bundle
var cssBundleHref = "/build/css-bundle-SGOFX6IC.css";

// app/root.js
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
var links = () => [
  ...cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []
];
async function loader({ request }) {
  let { userId } = await getAuth(request);
  return {
    userId,
    ENV: {
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
    }
  };
}
function App() {
  return _jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { children: [_jsx(Outlet, {}), _jsx(ScrollRestoration, {}), _jsx(Scripts, {}), _jsx(LiveReload, {})] })] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index
});
import { Link } from "@remix-run/react";
import { Sparkles, Zap, Code, MessageSquare } from "lucide-react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8 py-20 text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-7xl font-bold text-white mb-6", children: [
        "You bring the idea,",
        /* @__PURE__ */ jsx2("br", {}),
        /* @__PURE__ */ jsx2("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400", children: "we make the app" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-2xl text-gray-300 mb-12 max-w-3xl mx-auto", children: [
        "Describe your app in plain English. Answer 3 questions. Get a live URL in 2 minutes.",
        /* @__PURE__ */ jsx2("br", {}),
        "Then refine it through conversation."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center mb-16", children: [
        /* @__PURE__ */ jsx2(
          Link,
          {
            to: "/build",
            className: "px-10 py-5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white text-xl font-semibold transition-all hover:scale-105",
            children: "Start Building Free"
          }
        ),
        /* @__PURE__ */ jsx2(
          Link,
          {
            to: "/pricing",
            className: "px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-xl font-semibold transition-all",
            children: "See Pricing"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx2("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-20" }),
        /* @__PURE__ */ jsx2("div", { className: "relative bg-slate-800/50 backdrop-blur border border-white/10 rounded-3xl p-8", children: /* @__PURE__ */ jsx2("div", { className: "aspect-video bg-slate-900 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx2(Sparkles, { size: 64, className: "mx-auto mb-4 text-purple-400" }),
          /* @__PURE__ */ jsx2("p", { className: "text-white text-lg", children: "Interactive Demo Coming Soon" })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8 py-20", children: [
      /* @__PURE__ */ jsx2("h2", { className: "text-5xl font-bold text-white text-center mb-16", children: "How It Works" }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8", children: [
          /* @__PURE__ */ jsx2("div", { className: "w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx2(MessageSquare, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsx2("h3", { className: "text-2xl font-bold text-white mb-4", children: "1. Describe" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-300 text-lg", children: "Tell us what you want to build in plain English. No technical jargon needed." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8", children: [
          /* @__PURE__ */ jsx2("div", { className: "w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx2(Zap, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsx2("h3", { className: "text-2xl font-bold text-white mb-4", children: "2. Answer" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-300 text-lg", children: "We ask 3-5 smart questions to understand exactly what you need." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8", children: [
          /* @__PURE__ */ jsx2("div", { className: "w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx2(Code, { size: 32, className: "text-white" }) }),
          /* @__PURE__ */ jsx2("h3", { className: "text-2xl font-bold text-white mb-4", children: "3. Deploy" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-300 text-lg", children: "Get a live URL in 2 minutes. Then refine through conversation." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-8 py-20 text-center", children: [
      /* @__PURE__ */ jsx2("h2", { className: "text-5xl font-bold text-white mb-6", children: "Build Free. Pay Only to Scale." }),
      /* @__PURE__ */ jsxs("p", { className: "text-2xl text-gray-300 mb-12", children: [
        "$0 to build. $0 to deploy. $0 to host (up to 10k visits).",
        /* @__PURE__ */ jsx2("br", {}),
        "Then just $19/mo for your own domain."
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "inline-flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-8 py-4", children: /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx2("div", { className: "text-sm text-gray-400", children: "Average cost to build an app" }),
        /* @__PURE__ */ jsx2("div", { className: "text-3xl font-bold text-white", children: "$0" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "max-w-4xl mx-auto px-8 py-20 text-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12", children: [
      /* @__PURE__ */ jsx2("h2", { className: "text-4xl font-bold text-white mb-6", children: "Ready to build your app?" }),
      /* @__PURE__ */ jsx2(
        Link,
        {
          to: "/build",
          className: "inline-block px-12 py-6 bg-white text-purple-600 rounded-xl text-xl font-bold hover:scale-105 transition-all",
          children: "Start Building Now \u2192"
        }
      )
    ] }) })
  ] });
}

// app/routes/build.tsx
var build_exports = {};
__export(build_exports, {
  action: () => action,
  default: () => Build
});
import { useState } from "react";
import { json } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { Sparkles as Sparkles2, ArrowRight, Loader2 } from "lucide-react";

// app/lib/question-agent.ts
import OpenAI from "openai";
var SYSTEM_PROMPT = `You are FoundR's Question Agent. Your job is to understand what app the user wants to build by asking smart, targeted questions.

CRITICAL RULES:
1. Ask ONE question at a time
2. Keep questions simple and conversational
3. Use previous answers to inform next questions
4. Skip questions you can infer from context
5. Stop when you have enough info (usually 3-5 questions)
6. NEVER ask more than 7 questions total

CONVERSATION PHASES:

Phase 1: UNDERSTAND (1-2 questions)
- What type of app is this?
- Who will use it?

Phase 2: CLARIFY (2-3 questions)
- Key features they need
- Critical vs nice-to-have
- Technical requirements (API, auth, etc)

Phase 3: CONFIRM (1 question)
- Summarize what you understood
- Ask if anything is missing

Phase 4: BUILD
- Return "READY_TO_BUILD" with complete spec

QUESTION QUALITY:
\u2713 "Will other people use this with you?"
\u2717 "Do you need multi-user authentication?"

\u2713 "Where does the content come from - you'll add it, or pull from somewhere?"
\u2717 "What is your data ingestion strategy?"

\u2713 "Need people to log in, or just open and use?"
\u2717 "Specify authentication requirements"

CONTEXT AWARENESS:
If user says "cocktail app for my bar" you can infer:
- Solo use (just the bartender)
- Commercial context
- Mobile-friendly needed
- Speed is important

Don't ask what you already know.

WHEN TO STOP:
You have enough info when you know:
- What the app does (core function)
- Who uses it (solo/team/public)
- Key features (must-have vs nice-to-have)
- Any integrations (APIs, payment, etc)

OUTPUT FORMAT:
Return JSON:
{
  "type": "question" | "ready",
  "question": "Your question here",
  "options": ["Option 1", "Option 2", ...] // optional
  "reasoning": "Why you're asking this", // internal only
  "spec": {...} // only when type is "ready"
}

Remember: You're having a conversation, not filling out a form.`, QuestionAgent = class {
  openai;
  messages = [];
  constructor(apiKey) {
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://foundr.app",
        "X-Title": "FoundR"
      }
    });
  }
  async start(userInput) {
    return this.messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: `I want to build: ${userInput}`
      }
    ], await this.getResponse();
  }
  async answer(userAnswer) {
    return this.messages.push({
      role: "user",
      content: userAnswer
    }), await this.getResponse();
  }
  async getResponse() {
    try {
      let content = (await this.openai.chat.completions.create({
        model: "deepseek/deepseek-chat",
        // Free model
        messages: this.messages,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })).choices[0].message.content, result = JSON.parse(content);
      return this.messages.push({
        role: "assistant",
        content
      }), result;
    } catch (error) {
      return console.error("Question Agent error:", error), {
        type: "question",
        question: "What's the main thing people will do with this app?",
        options: ["Browse content", "Create/manage data", "Communicate/interact", "Track/monitor something"],
        reasoning: "Fallback question due to API error"
      };
    }
  }
  getConversation() {
    return this.messages;
  }
};

// app/lib/code-generator.ts
import OpenAI2 from "openai";
async function generateAppCode(request, apiKey) {
  let openai = new OpenAI2({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://foundr.app",
      "X-Title": "FoundR"
    }
  }), prompt = generateCodePrompt(request.spec, request.userRequest);
  try {
    return (await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      // Free model
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    })).choices[0].message.content || "";
  } catch (error) {
    throw console.error("Code generation error:", error), new Error("Failed to generate app code");
  }
}
function generateCodePrompt(spec, userRequest) {
  return `You are an expert full-stack developer. Build a complete, production-ready React application based on these requirements.

ORIGINAL REQUEST:
${userRequest}

APP SPECIFICATION:
${JSON.stringify(spec, null, 2)}

TECHNICAL REQUIREMENTS:

Framework: React with TypeScript
Styling: Tailwind CSS (use ONLY core utility classes, no custom classes)
Responsive: Mobile-first design
Performance: Optimize for fast load times

${spec.technicalRequirements?.auth ? `
Authentication: Include login/signup with Clerk
User roles: ${spec.userModel}
` : "No authentication needed"}

${spec.technicalRequirements?.database ? `
Database: Use Cloudflare D1 (SQLite)
Schema: Infer from requirements
CRUD operations: Include all necessary queries
` : "No database needed - use React state"}

${spec.technicalRequirements?.storage ? `
File Storage: Use Cloudflare R2
Upload handling: Include file upload UI
` : "No file storage needed"}

${spec.technicalRequirements?.apis?.length ? `
External APIs: ${spec.technicalRequirements.apis.join(", ")}
Error handling: Handle API failures gracefully
` : ""}

UI PRIORITIES:
- ${spec.uiPriority}
- Clean, modern design
- Intuitive navigation
- Fast interactions

FEATURES TO IMPLEMENT:
${spec.features?.map((f) => `- ${f}`).join(`
`)}

CODE STRUCTURE:

Create a single-file React component that includes:
1. All necessary imports
2. Type definitions
3. Component logic
4. Rendered UI
5. Inline styles (Tailwind)

CRITICAL RULES:
- \u2705 Production-ready code (no TODOs or placeholders)
- \u2705 Handle all error cases
- \u2705 Mobile responsive
- \u2705 Use ONLY Tailwind core classes
- \u2705 Include all functionality (no "implement later")
- \u274C NO localStorage or sessionStorage (not supported)
- \u274C NO console.logs in production code
- \u274C NO placeholder data (unless specified)

Return ONLY the complete React component code. No explanations, no markdown, just the code.`;
}

// app/lib/simple-deploy.ts
async function deployApp(request, env) {
  try {
    console.log("\u{1F680} Calling real VibeSDK for deployment..."), console.log("\u{1F4DD} App name:", request.appName), console.log("\u{1F464} User ID:", request.userId);
    let response = await fetch(`${env.VIBESDK_URL}/build`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.VIBESDK_API_KEY || "your-vibesdk-key"}`
      },
      body: JSON.stringify({
        prompt: `Build a ${request.appName} app based on: ${JSON.stringify(request.spec)}`,
        userId: request.userId,
        projectName: request.appName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        config: {
          framework: "react",
          buildCommand: "npm run build",
          outputDir: "dist"
        }
      })
    });
    if (!response.ok) {
      let errorText = await response.text();
      return console.error("\u274C VibeSDK deployment failed:", errorText), {
        url: "",
        appId: "",
        status: "failed",
        error: `VibeSDK error: ${response.status} ${errorText}`
      };
    }
    let data = await response.json();
    return console.log("\u2705 VibeSDK deployment successful:", data), {
      url: data.url || `https://${data.appId || "unknown"}.pages.dev`,
      appId: data.appId || generateAppId(),
      status: "deployed",
      logs: [
        "\u2713 AI code generation completed",
        "\u2713 Sandbox environment created",
        "\u2713 Dependencies installed",
        "\u2713 Application built",
        "\u2713 Deployed to Cloudflare Pages",
        `\u2713 Live at ${data.url || "deployment-url"}`
      ]
    };
  } catch (error) {
    return console.error("\u274C Deployment error:", error), {
      url: "",
      appId: "",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown deployment error"
    };
  }
}
function generateAppId() {
  let timestamp = Date.now().toString(36), random = Math.random().toString(36).substring(2, 8);
  return `app-${timestamp}-${random}`;
}

// app/routes/build.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
async function action({ request, context }) {
  let formData = await request.formData(), action2 = formData.get("action"), message = formData.get("message"), conversationJson = formData.get("conversation"), env = context.env, OPENROUTER_API_KEY = env.OPENROUTER_API_KEY || "";
  if (!OPENROUTER_API_KEY)
    return json({
      error: "OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable."
    }, { status: 500 });
  try {
    if (action2 === "start") {
      let agent = new QuestionAgent(OPENROUTER_API_KEY), response = await agent.start(message);
      return json({
        type: "question",
        response,
        conversation: agent.getConversation(),
        initialMessage: message
      });
    } else if (action2 === "answer") {
      if (!conversationJson)
        return json({ error: "No conversation history provided" }, { status: 400 });
      let conversation = JSON.parse(conversationJson), initialMessage = formData.get("initialMessage"), agent = new QuestionAgent(OPENROUTER_API_KEY);
      agent.messages = conversation;
      let response = await agent.answer(message);
      if (response.type === "ready" && response.spec) {
        console.log("Generating code for spec:", response.spec);
        let code = await generateAppCode({
          spec: response.spec,
          userRequest: initialMessage
        }, OPENROUTER_API_KEY);
        console.log("Code generated, deploying...");
        let userId = "demo-user", appName = response.spec.appName || "my-app", deployment = await deployApp({
          code,
          userId,
          appName,
          spec: response.spec
        }, env);
        return deployment.status === "failed" ? json({
          type: "error",
          error: deployment.error || "Deployment failed"
        }) : json({
          type: "complete",
          appUrl: deployment.url,
          appId: deployment.appId,
          logs: deployment.logs
        });
      }
      return json({
        type: "question",
        response,
        conversation: agent.getConversation(),
        initialMessage
      });
    }
    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return console.error("Build action error:", error), json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}
function Build() {
  let [messages, setMessages] = useState([]), [inputValue, setInputValue] = useState(""), [conversation, setConversation] = useState(null), [initialMessage, setInitialMessage] = useState(""), fetcher = useFetcher(), isLoading = fetcher.state !== "idle", handleStart = async () => {
    if (!inputValue.trim())
      return;
    setMessages([{
      role: "user",
      content: inputValue
    }]), setInitialMessage(inputValue);
    let formData = new FormData();
    formData.append("action", "start"), formData.append("message", inputValue), fetcher.submit(formData, { method: "POST" }), setInputValue("");
  }, handleAnswer = async (answer) => {
    let userMessage = {
      role: "user",
      content: answer
    };
    setMessages([...messages, userMessage]);
    let formData = new FormData();
    formData.append("action", "answer"), formData.append("message", answer), formData.append("conversation", JSON.stringify(conversation)), formData.append("initialMessage", initialMessage), fetcher.submit(formData, { method: "POST" });
  };
  if (fetcher.data && fetcher.state === "idle")
    if (fetcher.data.error)
      messages[messages.length - 1]?.role !== "error" && setMessages([...messages, {
        role: "assistant",
        content: `\u274C Error: ${fetcher.data.error}`
      }]);
    else if (fetcher.data.type === "question") {
      let response = fetcher.data.response;
      setConversation(fetcher.data.conversation), fetcher.data.initialMessage && setInitialMessage(fetcher.data.initialMessage), messages[messages.length - 1]?.content !== response.question && setMessages([...messages, {
        role: "assistant",
        content: response.question || "Let me ask you a question...",
        options: response.options
      }]);
    } else
      fetcher.data.type === "complete" && (messages.find((m) => m.isBuilding) ? messages.find((m) => m.appUrl) || setMessages([...messages, {
        role: "assistant",
        content: `\u{1F389} Your app is live!

${fetcher.data.appUrl}

Try it out! You can make changes by telling me what to adjust.`,
        appUrl: fetcher.data.appUrl
      }]) : setTimeout(() => {
        setMessages([...messages, {
          role: "assistant",
          content: "\u{1F389} Your app is being built! This will take about 2 minutes...",
          isBuilding: !0
        }]), setTimeout(() => {
          setMessages([...messages, {
            role: "assistant",
            content: "\u{1F389} Your app is being built! This will take about 2 minutes...",
            isBuilding: !0
          }, {
            role: "assistant",
            content: `\u{1F389} Your app is live!

${fetcher.data.appUrl}

Try it out! You can make changes by telling me what to adjust.`,
            appUrl: fetcher.data.appUrl
          }]);
        }, 2e3);
      }, 100));
  return /* @__PURE__ */ jsx3("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black", children: /* @__PURE__ */ jsxs2("div", { className: "max-w-4xl mx-auto p-8", children: [
    /* @__PURE__ */ jsxs2("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx3("h1", { className: "text-6xl font-bold text-white mb-4", children: "FoundR" }),
      /* @__PURE__ */ jsx3("p", { className: "text-2xl text-purple-300", children: "Describe your app, answer a few questions" })
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-6 min-h-[600px] max-h-[600px] overflow-y-auto", children: messages.length === 0 ? /* @__PURE__ */ jsxs2("div", { className: "text-center py-32", children: [
      /* @__PURE__ */ jsx3(Sparkles2, { size: 80, className: "mx-auto mb-8 text-purple-400 animate-pulse" }),
      /* @__PURE__ */ jsx3("p", { className: "text-3xl text-white mb-4 font-semibold", children: "What do you want to build?" }),
      /* @__PURE__ */ jsx3("p", { className: "text-xl text-gray-400", children: "Describe your app in plain English" }),
      /* @__PURE__ */ jsxs2("div", { className: "mt-8 text-left max-w-md mx-auto space-y-2", children: [
        /* @__PURE__ */ jsx3("p", { className: "text-gray-500 text-sm", children: "Examples:" }),
        /* @__PURE__ */ jsx3("p", { className: "text-gray-400", children: '"A cocktail recipe app for my bar"' }),
        /* @__PURE__ */ jsx3("p", { className: "text-gray-400", children: '"Breathing exercise app for my students"' }),
        /* @__PURE__ */ jsx3("p", { className: "text-gray-400", children: '"Schedule manager for my cheer team"' })
      ] })
    ] }) : /* @__PURE__ */ jsxs2("div", { className: "space-y-6", children: [
      messages.map((msg, i) => /* @__PURE__ */ jsxs2(
        "div",
        {
          className: `p-6 rounded-2xl animate-fade-in ${msg.role === "user" ? "ml-12 bg-purple-600" : "mr-12 bg-slate-700"} text-white`,
          children: [
            /* @__PURE__ */ jsx3("div", { className: "whitespace-pre-wrap", children: msg.content }),
            msg.appUrl && /* @__PURE__ */ jsx3("div", { className: "mt-4", children: /* @__PURE__ */ jsx3(
              "a",
              {
                href: msg.appUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-all",
                children: "Open App \u2192"
              }
            ) }),
            msg.options && !isLoading && /* @__PURE__ */ jsx3("div", { className: "mt-4 grid gap-2", children: msg.options.map((option, j) => /* @__PURE__ */ jsxs2(
              "button",
              {
                onClick: () => handleAnswer(option),
                className: "p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-left transition-all hover:scale-102",
                children: [
                  option,
                  /* @__PURE__ */ jsx3(ArrowRight, { className: "inline ml-2", size: 16 })
                ]
              },
              j
            )) })
          ]
        },
        i
      )),
      isLoading && /* @__PURE__ */ jsxs2("div", { className: "mr-12 bg-slate-700 p-6 rounded-2xl flex items-center gap-3", children: [
        /* @__PURE__ */ jsx3(Loader2, { className: "animate-spin text-purple-400", size: 24 }),
        /* @__PURE__ */ jsx3("span", { className: "text-white", children: "Thinking..." })
      ] })
    ] }) }),
    messages.length === 0 ? /* @__PURE__ */ jsxs2("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx3(
        "input",
        {
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyPress: (e) => e.key === "Enter" && !isLoading && handleStart(),
          placeholder: "I need a cocktail recipe app for my bar...",
          className: "flex-1 px-6 py-5 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500",
          autoFocus: !0,
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: handleStart,
          disabled: isLoading || !inputValue.trim(),
          className: "px-10 py-5 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
          children: "Start Building"
        }
      )
    ] }) : /* @__PURE__ */ jsxs2("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx3("p", { className: "text-gray-400 mb-4", children: "Choose an option above or describe what you want to change" }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: () => {
            setMessages([]), setConversation(null), setInitialMessage("");
          },
          className: "px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all",
          disabled: isLoading,
          children: "Start Over"
        }
      )
    ] })
  ] }) });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-QJLL26WR.js", imports: ["/build/_shared/chunk-ASUPBI2L.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-KKI5SNXK.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-VDVDM46Y.js", imports: ["/build/_shared/chunk-IUP3VDNG.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/build": { id: "routes/build", parentId: "root", path: "build", index: void 0, caseSensitive: void 0, module: "/build/routes/build-2HLAG63F.js", imports: ["/build/_shared/chunk-IUP3VDNG.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "cca80f3d", hmr: void 0, url: "/build/manifest-CCA80F3D.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public\\build", future = { v3_fetcherPersist: !0, v3_relativeSplatPath: !0, v3_throwAbortReason: !0, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_cloudflare_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/build": {
    id: "routes/build",
    parentId: "root",
    path: "build",
    index: void 0,
    caseSensitive: void 0,
    module: build_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
