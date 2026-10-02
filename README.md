# Ola News Tracker

Tracks news for Ola Cabs and Ola Electric. React + Vite frontend, serverless `/api/news` (Vercel-compatible, not deployed yet).

- News: GDELT DOC 2.0 API (free, no key, terms allow commercial use with citation). Results cached 15 min to respect its 1 request / 5 s limit.
- AI brief (optional): any OpenAI-compatible API, e.g. Gemini API free quota. Set `AI_API_KEY` in `.env`. Without it, a plain headline list is shown.
- Twitter/X is not used: no free production API.

## Run
    npm install
    cp .env.example .env   # optional
    npm run dev
    npm test
