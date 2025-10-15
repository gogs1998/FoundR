# Environment Variables Setup

## Required Environment Variables

FoundR requires the following environment variables to be configured:

### 1. OpenRouter API Key

**Variable**: `OPENROUTER_API_KEY`

**How to get it**:
1. Go to https://openrouter.ai/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)

**Where to add it**:
- **Local development**: Create a `.dev.vars` file in the project root:
  ```
  OPENROUTER_API_KEY=sk-or-v1-your-key-here
  ```
- **Cloudflare Pages**: Go to your project → Settings → Environment Variables → Add variable

### 2. VibeSDK URL

**Variable**: `VIBESDK_URL`

**Value**: `https://vibesdk-production1.gogs1998.workers.dev`

**Where to add it**:
- **Local development**: Add to `.dev.vars`:
  ```
  VIBESDK_URL=https://vibesdk-production1.gogs1998.workers.dev
  ```
- **Cloudflare Pages**: Go to your project → Settings → Environment Variables → Add variable

### 3. Optional: Clerk Authentication

**Variable**: `CLERK_PUBLISHABLE_KEY`

**How to get it**:
1. Go to https://clerk.com/
2. Create an account and application
3. Get the publishable key from your dashboard

### 4. Optional: Stripe Payments

**Variable**: `STRIPE_PUBLISHABLE_KEY`

**How to get it**:
1. Go to https://stripe.com/
2. Create an account
3. Get the publishable key from your dashboard

## Security Best Practices

### Never Commit Secrets

The following files are already in `.gitignore` and should NEVER be committed:
- `.env`
- `.dev.vars`
- Any file containing API keys or secrets

### Rotate Keys Regularly

If you suspect a key has been exposed:
1. Immediately revoke it in the service dashboard (OpenRouter, Clerk, etc.)
2. Generate a new key
3. Update the environment variables in all environments
4. If the key was committed to git, consider using tools like:
   - `git-filter-repo` to rewrite history
   - `BFG Repo-Cleaner` to remove sensitive data

### Use Different Keys Per Environment

Consider using different API keys for:
- Local development
- Preview deployments
- Production

This limits the blast radius if a key is compromised.

## Cloudflare Pages Setup

1. Log into Cloudflare Dashboard
2. Navigate to Pages → Your project (foundr)
3. Go to Settings → Environment Variables
4. Add variables for both "Production" and "Preview" environments
5. Click "Save"
6. Trigger a new deployment to apply the changes

## Local Development Setup

1. Copy `.env.example` to `.dev.vars` (if .env.example exists)
2. Or create a new `.dev.vars` file with the variables above
3. Fill in your actual API keys
4. Run `npm run dev` to start local server
5. The app will automatically load variables from `.dev.vars`

## Troubleshooting

### "OpenRouter API key not configured" Error

- Check that `OPENROUTER_API_KEY` is set in Cloudflare Pages environment variables
- Verify the key is valid at https://openrouter.ai/keys
- Make sure you saved the variable and redeployed

### Variables Not Loading

- Ensure variables are set for the correct environment (Production vs Preview)
- Redeploy after adding new variables
- Check Cloudflare Pages deployment logs for errors

### Key Was Exposed

If you accidentally committed an API key:
1. **Immediately revoke the key** in the service dashboard
2. Generate a new key
3. Update `.dev.vars` locally
4. Update Cloudflare Pages environment variables
5. Remove the key from git history (see Security Best Practices above)
6. Push the cleaned history

## Example .dev.vars File

```bash
# OpenRouter (required)
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# VibeSDK (required)
VIBESDK_URL=https://vibesdk-production1.gogs1998.workers.dev

# Clerk (optional)
CLERK_PUBLISHABLE_KEY=pk_test_your-key-here

# Stripe (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
```

**Remember**: NEVER commit `.dev.vars` or `.env` files to git!
