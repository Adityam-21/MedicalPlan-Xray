# MedicalPlan-Xray — frontend

React 19 + Vite + Tailwind CSS + React Router + React Hook Form. Consumes the FastAPI backend's
v2 API (`POST /predict`, `GET /model`). See the [root README](../README.md) for the model, the
audit and the reasoning behind the design.

## Run

```bash
npm install
cp .env.example .env     # set VITE_API_URL to the backend, e.g. http://127.0.0.1:8000
npm run dev              # http://localhost:5173
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

## Structure

```
src/pages/               Home, Predict, About, NotFound
src/components/predict/  PredictionForm, PredictionResult (report grid), charts
src/components/layout/   Navbar, Footer, ThemeToggle, PageContainer, Layout
src/components/common/   Input, Select, Button, Card and field primitives
src/utils/               format.js (INR display), formOptions.js, planGuide.js
```

## Conventions

- **Theme tokens live in `src/index.css`** and the `.panel` / `.eyebrow` classes; dark mode uses
  Tailwind's `class` strategy, set before first paint by an inline script in `index.html`.
- **Plan tiers use a sequential colour scale**, never a traffic light: a High tier is a
  recommendation, not a danger signal.
- **No charting library.** The bars and strips are plain elements, so the bundle stays small.
- **Nothing about model quality is hardcoded.** Scores, versions, thresholds and warnings all come
  from the API response, so the UI cannot drift from the deployed model.
