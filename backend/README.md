---
title: MedicalPlan-Xray API
emoji: 🩺
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 8000
pinned: false
license: mit
---

# MedicalPlan-Xray API

FastAPI service for the [MedicalPlan-Xray](https://github.com/Adityam-21/MedicalPlan-Xray)
plan-tier recommender. Serves a scikit-learn decision tree (macro-F1 0.814 ± 0.021, 5-fold CV)
and returns the reasoning behind every prediction.

The frontmatter above configures this folder as a Hugging Face Docker Space. It is ignored by
GitHub and has no effect on local runs.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/predict` | Plan tier, probabilities, decision path, close-call analysis, warnings |
| `GET` | `/model` | Model summary and cross-validated scores |
| `GET` | `/health` | Liveness probe |
| `GET` | `/docs` | Interactive OpenAPI docs |

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` | yes | Prediction log |
| `SUPABASE_KEY` | yes | Anon key; logging fails softly if unreachable |
| `CORS_ORIGINS` | no | Comma-separated allowed browser origins |
| `PORT` | no | Defaults to 8000 |

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --port 8000
```

Educational demo on synthetic data. Not insurance, financial or medical advice.
