# FoundR - Build Apps Through Conversation

FoundR is an AI-powered no-code platform where users describe apps in plain English, answer 3-5 conversational questions, and get a live deployed URL in 2 minutes.

## 🚀 What Makes FoundR Different

**Traditional No-Code Platforms:**
- Generate code that doesn't work
- Manual deployment headaches
- Credit-draining regenerations
- Templates that are 70% right, 30% wrong

**FoundR:**
- Conversational AI that understands requirements
- Automatic deployment (no technical knowledge needed)
- Conversational refinements (just describe changes)
- Free to build, pay only for hosting

## 🎯 The Complete User Journey

### Phase 1: BUILD (2 minutes)
```
User: "I need a cocktail recipe app for my bar"
FoundR: "Got it! Quick questions:
         1. Just you or staff too?
         2. Your recipes or API?
         3. Search or browse priority?"
User: [Answers in 30 seconds]
FoundR: "Building now..."
Result: https://cocktails-john.foundr.app ✅
```

### Phase 2: REFINE (ongoing)
```
User: "Make search bigger"
FoundR: [Updates code, redeploys in 30 seconds]
User: "Add favorites"
FoundR: [Adds feature, redeploys]
Result: Perfect customized app ✅
```

## 🛠️ Tech Stack

- **Frontend:** Remix + React + TypeScript + Tailwind CSS
- **Backend:** Cloudflare Workers + VibeSDK
- **AI:** OpenRouter (free models: DeepSeek, Qwen, Llama)
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2
- **Auth:** Clerk (optional)
- **Billing:** Stripe (optional)
- **Deployment:** Cloudflare Pages

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone <repository>
cd FoundR
npm install
```

### 2. Configure Environment Variables

Copy `.dev.vars` and add your keys:

```bash
# Get free OpenRouter API key from https://openrouter.ai/
OPENROUTER_API_KEY=your-key-here

# Optional: VibeSDK deployment key
VIBESDK_API_KEY=your-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see FoundR in action!

## 🔑 Getting API Keys

### OpenRouter (Required - Free)

1. Visit https://openrouter.ai/
2. Sign up for a free account
3. Generate an API key
4. Add to `.dev.vars` file

**Why OpenRouter?**
- Access to free AI models (DeepSeek, Qwen, Llama)
- No credit card required
- Perfect for development and production

### VibeSDK (Required for Deployment)

VibeSDK handles code execution, sandboxing, and automatic deployment.

**Option 1: Use Cloudflare's VibeSDK (Recommended)**
```bash
# Clone VibeSDK
git clone https://github.com/cloudflare/vibesdk
cd vibesdk

# Deploy to Cloudflare
wrangler deploy

# Copy the deployment URL and add to .dev.vars
VIBESDK_URL=https://your-vibesdk.workers.dev
```

**Option 2: Use Public VibeSDK Instance**
```bash
# In .dev.vars
VIBESDK_URL=https://vibesdk-production1.gogs1998.workers.dev
```

### Clerk (Optional - For Authentication)

1. Visit https://clerk.com
2. Create a new application
3. Get your API keys
4. Add to `.dev.vars`

### Stripe (Optional - For Billing)

1. Visit https://stripe.com
2. Create an account
3. Get your test API keys
4. Add to `.dev.vars`

## 📁 Project Structure

```
foundr/
├── app/
│   ├── lib/
│   │   ├── question-agent.ts      # AI conversation system
│   │   ├── code-generator.ts      # Code generation prompts
│   │   └── simple-deploy.ts       # VibeSDK integration
│   ├── routes/
│   │   ├── _index.tsx            # Landing page
│   │   └── build.tsx             # Conversational builder
│   ├── root.tsx                  # App wrapper
│   └── tailwind.css              # Global styles
├── package.json                  # Dependencies
├── wrangler.toml                 # Cloudflare config
├── .dev.vars                     # Environment variables
└── README.md                     # You are here
```

## 🚧 Current Status

✅ **Completed:**
- ✅ Project structure (Remix + Cloudflare)
- ✅ Beautiful landing page with hero, features, pricing
- ✅ Conversational chat interface
- ✅ Question Agent (AI conversation system)
- ✅ Code Generator (AI code generation)
- ✅ VibeSDK integration for deployment
- ✅ Tailwind CSS styling with purple gradient theme
- ✅ Environment configuration

🔄 **Next Steps:**
- ⏳ Test complete build flow with real AI
- ⏳ Set up Cloudflare D1 database
- ⏳ Create user dashboard for managing apps
- ⏳ Add Clerk authentication
- ⏳ Integrate Stripe billing
- ⏳ Deploy to production

## 🎨 Design Philosophy

**Conversational First:** Everything happens through natural conversation, not forms or menus.

**Beautiful by Default:** Every generated app looks professional and modern.

**Mobile First:** All apps work perfectly on mobile devices.

**Dark Theme:** Purple gradient theme throughout the platform.

## 🌟 Key Features

### Smart Question System
- AI analyzes user input to understand intent
- Asks only relevant questions (3-5 total)
- Adapts based on previous answers
- Skips questions it can infer

### Code Generation
- Uses DeepSeek via OpenRouter (free tier)
- Generates production-ready React + TypeScript
- Tailwind CSS for styling
- Mobile-responsive by default

### Automatic Deployment
- No GitHub, no deployment commands
- No environment variables to configure
- Just a live URL in 2 minutes
- SSL certificates included

## 💰 Revenue Model (Future)

```
Tier        Price    Visits/Month    Features
Free        $0       10,000          Unlimited apps, .foundr.app subdomain
Starter     $19/mo   100,000         Custom domain, no branding, SSL
Pro         $49/mo   500,000         Team access, GitHub backup, analytics
Business    $149/mo  5,000,000       White-label, API access, SLA
Enterprise  Custom   Unlimited       Dedicated infrastructure
```

## 🧪 Testing the Build Flow

1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:3000/build
3. Type: "I need a cocktail recipe app for my bar"
4. Answer the AI's questions
5. Watch your app get built and deployed!

## 🐛 Troubleshooting

### "OpenRouter API key not configured"
- Make sure you've added `OPENROUTER_API_KEY` to `.dev.vars`
- Restart the dev server after adding the key

### "VibeSDK deployment failed"
- Check that `VIBESDK_URL` is correctly configured
- Try using the public VibeSDK instance URL
- Make sure your VibeSDK deployment is running

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Remix cache
rm -rf .cache build
npm run dev
```

## 📚 Documentation

- [Remix Documentation](https://remix.run/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [OpenRouter API](https://openrouter.ai/docs)
- [VibeSDK Documentation](https://github.com/cloudflare/vibesdk)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is an open-source project. Contributions welcome for:
- Bug fixes
- UI improvements
- Documentation
- Test cases
- New features

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Cloudflare Workers, VibeSDK, and free AI models.**

Need help? Open an issue or reach out on Discord!
