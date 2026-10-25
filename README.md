# Roamly — Personalized Travel Itinerary Planner

A polished React + Vite + Express travel planner with an AI-ready itinerary API.

## What is included
- 17 destinations with destination-specific highlights and imagery
- Personalized planning: destination, duration, travelers, budget and interests
- Quick-start trip presets
- Searchable destination explorer
- Smart local itinerary fallback when Gemini is not configured
- Optional Gemini API integration through the Express backend
- Estimated trip budget snapshot
- Pre-trip checklist
- Google Maps destination links
- Save trips through optional Supabase integration
- Share and export itinerary as a `.txt` file
- Responsive desktop/tablet/mobile UI

## Run locally

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5050`

If Windows reports `spawn cmd.exe ENOENT`, make sure `C:\Windows\System32` is in your PATH and reopen the terminal.

## Optional environment variables
Copy `.env.example` to `.env` and add:

- `GEMINI_API_KEY` — enables Gemini itinerary generation
- `SUPABASE_URL` — enables cloud trip saving
- `SUPABASE_SERVICE_ROLE_KEY` — enables server-side Supabase writes

Without these keys, the app still works in demo/local mode.

## Useful commands

```bash
npm run dev
npm run build
npm test
npm run lint
```
