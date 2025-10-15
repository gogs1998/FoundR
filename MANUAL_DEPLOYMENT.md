# 🚀 Manual VibeSDK Deployment Guide

Since we're having CLI issues, here's how to complete the VibeSDK deployment manually through the Cloudflare Dashboard:

## **Step 1: Go to Cloudflare Dashboard**

**Visit:** https://dash.cloudflare.com/

## **Step 2: Deploy the Worker**

1. **Navigate:** Workers → Create Worker
2. **Choose:** "Upload Assets" or create from the vibesdk directory
3. **Upload the built files:**
   - Upload `vibesdk/dist/` directory contents
   - Set main file as `index.js`
4. **Name:** `vibesdk-production`

## **Step 3: Configure Environment Variables**

In your Worker settings, add these environment variables:

### **Required Variables:**
```
GOOGLE_AI_STUDIO_API_KEY = "AIzaSyAjSm3AbfpVOUKfzbky8uQFndIG3NFbgkg"
OPENROUTER_API_KEY = "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"
JWT_SECRET = "vibesdk_jwt_secret_key_2025_production_ready_secure_random_value_xyz"
WEBHOOK_SECRET = "vibesdk_webhook_secret_2025_production_ready_secure_random_value_xyz"
```

### **Configuration Variables:**
```
TEMPLATES_REPOSITORY = "https://github.com/cloudflare/vibesdk-templates"
ALLOWED_EMAIL = "gordonshepherd1@hotmail.com"
DISPATCH_NAMESPACE = "vibesdk-default-namespace"
ENABLE_READ_REPLICAS = "true"
CLOUDFLARE_AI_GATEWAY = "vibesdk-gateway"
CUSTOM_DOMAIN = ""
MAX_SANDBOX_INSTANCES = "10"
SANDBOX_INSTANCE_TYPE = "standard-3"
```

## **Step 4: Configure Routes**

**Add Custom Domain:**
- **Route:** `vibesdk-production.gogs1998.workers.dev`
- **Type:** Custom Domain

## **Step 5: Bind Resources**

**Connect these resources to your Worker:**

1. **D1 Database:** `vibesdk-dbgrok`
2. **R2 Bucket:** `vibesdk-templatesgrok`
3. **KV Namespace:** `grok-production` (or whatever name you used)
4. **Durable Objects:** CodeGeneratorAgent, UserAppSandboxService
5. **AI Binding:** Enable AI inference

## **Step 6: Deploy**

1. **Click "Save and Deploy"**
2. **Wait for deployment** (usually 1-2 minutes)
3. **Verify** the Worker is running

## **Step 7: Test VibeSDK**

1. **Visit:** `https://vibesdk-production.gogs1998.workers.dev`
2. **Try building a test app**
3. **Verify** AI code generation works

## **Step 8: Update FoundR**

Once VibeSDK is deployed, update `foundr/grok/wrangler.toml`:

```toml
[vars]
VIBESDK_URL = "https://vibesdk-production.gogs1998.workers.dev"
VIBESDK_API_KEY = "your-vibesdk-key"
```

## **What This Gets Us:**

✅ **Real AI code generation** with your API keys
✅ **Automatic app deployment** to live URLs
✅ **Sandboxed execution** for safe code generation
✅ **Template system** with 6 pre-built templates
✅ **Production-ready infrastructure**

## **Need Help?**

If you get stuck on any step, I can provide more detailed instructions for that specific part!

**This manual approach often works better than CLI** and gives you full control over the deployment! 🚀
