# MedicalPlan-Xray — Frontend

React + Vite + Tailwind CSS + React Router + Axios frontend for the MedicalPlan-Xray
insurance plan recommender. Consumes the existing FastAPI backend exactly as
implemented (`POST /predict`) — no backend code lives in or is modified by this repo.

## Phase 1 status: scaffold only

This is the initial project scaffold. Pages are placeholders. No prediction
form, no API calls wired up yet, no design system applied. That comes in the
next phase.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` by default and expects the backend at
the URL configured in `.env` (`VITE_API_BASE_URL`, default `http://localhost:8000`).

## Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment variables

See `.env.example`. `VITE_API_BASE_URL` must point at a running instance of
the backend. CORS must be enabled on the backend for the frontend's origin —
confirm this before integrating in Phase 2.
