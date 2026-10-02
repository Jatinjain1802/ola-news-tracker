# Ola News Tracker

Tracks news for Ola Cabs and Ola Electric. React + Vite frontend, serverless `/api/news` (Vercel-compatible, not deployed yet).

- News: NewsData.io free plan if NEWSDATA_API_KEY is set (about 12h delayed). Otherwise labelled sample demo data. GDELT is optional (USE_GDELT=1), unreliable from Vercel.
- AI brief (optional): any OpenAI-compatible API, e.g. Gemini API free quota. Set `AI_API_KEY` in `.env`. Without it, a plain headline list is shown.
- Twitter/X is not used: no free production API.

## Run
    npm install
    cp .env.example .env   # optional
    npm run dev
    npm test
