# 🚀 VibeSDK Deployment Guide

## Step 1: Get Required API Keys

### **Google Gemini API Key** (Required)
1. Go to https://ai.google.dev/
2. Click "Get started"
3. Create a new API key
4. Copy the key (it starts with `AIza...`)

### **OpenRouter API Key** (Optional but recommended)
1. Go to https://openrouter.ai/
2. Sign up for a free account
3. Go to "API Keys" in your dashboard
4. Create a new API key
5. Copy the key

## Step 2: Cloudflare Setup

### **Prerequisites:**
- Cloudflare account
- Workers Paid Plan ($5/month)
- Workers for Platforms subscription

### **Create Database (D1)**
```bash
wrangler d1 create vibesdk-db
```

### **Create Storage Bucket (R2)**
```bash
wrangler r2 bucket create vibesdk-templates
```

### **Create KV Store**
```bash
wrangler kv:namespace create vibesdk-store
```

## Step 3: Deploy VibeSDK

### **Configure Environment**
Edit `vibesdk/.env.local`:
```bash
GOOGLE_AI_STUDIO_API_KEY=your_actual_gemini_key
OPENROUTER_API_KEY=your_actual_openrouter_key
JWT_SECRET=your_secure_random_string
WEBHOOK_SECRET=your_webhook_secret
CUSTOM_DOMAIN=your-domain.com
ALLOWED_EMAIL=your-email@domain.com
```

### **Deploy to Cloudflare**
```bash
cd vibesdk
wrangler deploy
```

## Step 4: Update FoundR Configuration

Once VibeSDK is deployed, update `foundr/grok/wrangler.toml`:

```toml
[vars]
VIBESDK_URL = "https://your-vibesdk-worker.workers.dev"
```

## Step 5: Test the Integration

1. **Test VibeSDK directly:**
   - Visit your deployed VibeSDK URL
   - Try building a simple app

2. **Test FoundR integration:**
   - Update FoundR to call VibeSDK
   - Try the conversational flow

## Troubleshooting

### **"Missing API Key" Errors**
- Verify all required keys are set in `.env.local`
- Check that keys are valid and have proper permissions

### **"Database Connection Failed"**
- Ensure D1 database was created successfully
- Check database binding in `wrangler.jsonc`

### **"Deployment Failed"**
- Check Cloudflare Workers logs: `wrangler tail`
- Verify all environment variables are set
- Ensure Workers Paid Plan is active

## Next Steps After Deployment

1. ✅ **VibeSDK deployed and tested**
2. 🔄 **Update FoundR to use VibeSDK**
3. 🔄 **Test end-to-end app building**
4. 🔄 **Add authentication (Clerk)**
5. 🔄 **Add billing (Stripe)**

---

**Questions?** Let me know what API keys you have or where you get stuck! 🚀
