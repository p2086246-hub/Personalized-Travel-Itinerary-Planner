# SkillWallet Activity Coverage

## Epic 1 — Vibe Coding Environment
**1.1** Cursor + GitHub: open this repository in Cursor and initialize/push Git.
**1.2** AI tools: use Cursor Agent/ChatGPT to iterate on the files.
**1.3** AI folder generation: this repository is already organized into client, server, supabase, tests and docs.

## Epic 2 — Supabase
**2.1** Create a Supabase project.
**2.2** Run `supabase/schema.sql` in the SQL Editor.
**2.3** Copy values into `.env` from `.env.example`. Never commit `.env`.

## Epic 3 — Preferences & Recommendation
**3.1** React captures destination, days, travelers, budget and interests.
**3.2** `server/index.js` creates a structured Gemini prompt through `buildPrompt()`.
**3.3** `/api/recommendations` provides destination recommendations based on preferences.

## Epic 4 — Itinerary & Personalization
**4.1** `/api/itinerary/generate` creates a day-by-day itinerary.
**4.2** The itinerary groups activities into morning/lunch/evening blocks and marks route optimization.
**4.3** Interests alter food, nature, shopping, nightlife and adventure choices; budget alters pacing.

## Epic 5 — Productization
**5.1** `/api/trips` saves trips to Supabase when configured.
**5.2** Browser Share API + text export are included.
**5.3** `npm test`, `npm run lint`, `npm run build` support validation and production builds.
**5.4** `.env.example` separates public client config from backend-only secrets.

## Epic 6 — Deployment
**6.1 Render:** deploy the Node server. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `PORT`.
**6.2 Vercel:** deploy the Vite frontend. Set `VITE_API_URL` to the Render backend URL.

## Epic 7 — Testing
**7.1** Run `npm test`, then test generate/save/export/share in browser.
**7.2** Save a trip and verify it appears in the Supabase `trips` table.

## Outputs
- Working responsive travel planner
- Preference capture UI
- Recommendation endpoint
- Gemini-ready prompt + fallback engine
- Daily itinerary generation
- Save/share/export
- Supabase schema
- Automated smoke tests
- Deployment configuration
