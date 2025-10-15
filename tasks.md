# FoundR Multi-Stage Build Plan

This plan breaks the FoundR implementation into discrete, LLM-friendly tasks. Work through the phases in order; each task lists the key files, success criteria, and any verification steps.

---

## Phase 0 · Environment & Access

- [ ] **0.1 · Verify local tooling**  
  _Goal:_ Ensure Node.js (>=18), npm, Wrangler CLI, and Git are installed.  
  _Check:_ `node -v`, `npm -v`, `wrangler --version`, `git --version`.

- [ ] **0.2 · Authenticate with Cloudflare**  
  _Goal:_ Run `npx wrangler login` successfully for both `vibesdk/` and `foundr/grok/`.  
  _Files:_ None.  
  _Check:_ `wrangler whoami` returns account info.

- [ ] **0.3 · Configure secrets**  
  _Goal:_ Replace placeholders in `vibesdk/.env.local` and prepare environment variables for the Remix app.  
  _Files:_ `vibesdk/.env.local`, `foundr/grok/.env` (create).  
  _Check:_ No placeholder values remain; secrets stored via `wrangler secret put`.

---

## Phase 1 · VibeSDK Backend

- [ ] **1.1 · Review & prune VibeSDK defaults**  
  _Goal:_ Understand the generated Workers project and remove demo routes/features not needed.  
  _Files:_ `vibesdk/src/**/*`.  
  _Check:_ Only required build/deploy endpoints remain; README updated if APIs change.

- [ ] **1.2 · Implement build endpoint wrapper**  
  _Goal:_ Expose a stable API (`POST /build`) that accepts prompt + metadata and proxies to VibeSDK sandboxes.  
  _Files:_ `vibesdk/src/routes/build.ts` (or equivalent).  
  _Check:_ `curl` with sample payload returns `{ url, status }` and creates a preview app.

- [ ] **1.3 · Add telemetry & persistence**  
  _Goal:_ Log each build (user id, tokens used, duration) into D1 or KV.  
  _Files:_ `vibesdk/src/services/*`, D1 schema migration.  
  _Check:_ Entries visible via `wrangler d1 execute` query.

- [ ] **1.4 · Harden error handling**  
  _Goal:_ Catch sandbox errors, surface user-friendly messages, and retry transient failures.  
  _Files:_ Same as above.  
  _Check:_ Fault injection test returns JSON with `status="error"` + message.

---

## Phase 2 · FoundR Conversation Engine

- [ ] **2.1 · Implement pattern detector**  
  _Goal:_ Create `app/lib/patterns.server.ts` to classify user requests (content library, booking, tracker, etc.).  
  _Check:_ Unit tests cover the three validation apps (cocktail, breathing, cheer team).

- [ ] **2.2 · Build dynamic question agent**  
  _Goal:_ `app/lib/conversation.server.ts` manages LLM prompts, previous answers, and follow-up logic.  
  _Files:_ `foundr/grok/app/lib/*`.  
  _Check:_ Mock conversation reaches `READY_TO_BUILD` within 5-7 turns.

- [ ] **2.3 · Wire OpenRouter client**  
  _Goal:_ Create shared SDK for calling DeepSeek/Qwen models with backoff + logging.  
  _Files:_ `app/lib/openrouter.server.ts`.  
  _Check:_ `npm test conversation` hits OpenRouter sandbox key successfully.

---

## Phase 3 · Frontend Integration (Remix)

- [ ] **3.1 · Connect `/build` route to question agent**  
  _Goal:_ Replace stubbed chat logic in `app/routes/build.tsx` with real conversation state using Remix actions/loaders.  
  _Check:_ Local dev interaction shows adaptive questions and summary before build.

- [ ] **3.2 · Trigger VibeSDK deploys**  
  _Goal:_ When conversation ends, call Phase 1 API, show progress UI, persist result in D1.  
  _Files:_ `app/routes/build.tsx`, `app/lib/apps.server.ts`.  
  _Check:_ Completed flow returns live URL rendered in success card.

- [ ] **3.3 · Implement refinement loop**  
  _Goal:_ Allow follow-up prompts to patch existing app (diff-based update, redeploy).  
  _Files:_ Same as above plus new API route.  
  _Check:_ "Increase search bar size" redeploys updated app without losing data.

---

## Phase 4 · Accounts & Billing

- [ ] **4.1 · Add Clerk authentication**  
  _Goal:_ Gate build/refine actions behind sign-in using Clerk Remix SDK.  
  _Files:_ `app/root.tsx`, `app/routes/*`.  
  _Check:_ Unauthenticated users redirected to login modal.

- [ ] **4.2 · Persist user/app data**  
  _Goal:_ Create D1 schema for users, apps, usage.  
  _Files:_ `foundr/grok/migrations/*`, `app/lib/db.server.ts`.  
  _Check:_ `wrangler d1 execute` shows relational integrity.

- [ ] **4.3 · Integrate Stripe metered billing**  
  _Goal:_ Plans (Free/Starter/Pro/Business) with automated visit overages.  
  _Files:_ `app/routes/api/stripe.webhook.ts`, billing UI components.  
  _Check:_ Test mode checkout + webhook updates plan/usage rows.

---

## Phase 5 · Dashboard & Analytics

- [ ] **5.1 · Build user dashboard**  
  _Goal:_ `/dashboard` lists apps, visit counts, plan status, and action buttons.  
  _Files:_ `app/routes/dashboard.tsx`, supporting components.  
  _Check:_ Fixture user sees seeded app list in dev.

- [ ] **5.2 · Usage telemetry**  
  _Goal:_ Nightly worker aggregates visits, stores per-app stats, updates Stripe usage.  
  _Files:_ New cron worker in `wrangler.toml`.  
  _Check:_ Cron log shows updates; Stripe metered usage reflects numbers.

- [ ] **5.3 · Support requests & health checks**  
  _Goal:_ Add status endpoint (`/api/health`), Slack/email integration for build failures.  
  _Check:_ Synthetic monitor hits endpoint, notifications fire on failure.

---

## Phase 6 · QA, Deployment & Docs

- [ ] **6.1 · End-to-end smoke test**  
  _Goal:_ Scripted flow (Playwright) that builds cocktail app, verifies live URL, performs refinement.  
  _Files:_ `foundr/grok/tests/e2e/*.spec.ts`.  
  _Check:_ `npm run test:e2e` passes locally and in CI.

- [ ] **6.2 · Production deployment**  
  _Goal:_ Deploy VibeSDK + FoundR to Cloudflare (Pages/Workers), map domains.  
  _Check:_ `foundr.app` + `api.foundr.app` respond with expected content.

- [ ] **6.3 · Documentation update**  
  _Goal:_ Extend `README.md` with setup instructions, troubleshooting, pricing table, roadmap.  
  _Files:_ `foundr/grok/README.md`, new `DEPLOYMENT.md`.  
  _Check:_ Docs mention environment variables, deployment steps, support contact.

---

## Phase 7 · Post-MVP Enhancements (Backlog)

- [ ] Template marketplace MVP (share/export blueprints)
- [ ] Team collaboration (multi-user app editing)
- [ ] API access for automation & integrations
- [ ] Revenue-share contract workflow
- [ ] Marketing site A/B testing + SEO landing pages

---

_Work incrementally, committing after each completed task with clear messages (e.g., `feat(question-agent): add dynamic conversation engine`). Ensure all lint/tests pass before marking boxes complete._