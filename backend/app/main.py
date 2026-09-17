import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import API_TITLE, API_VERSION
from app.routes import router

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://medical-plan-xray.vercel.app",
]

# Override with a comma-separated list, e.g.
# CORS_ORIGINS=https://my-site.vercel.app,http://localhost:5173
cors_env = os.getenv("CORS_ORIGINS", "")
cors_origins = [o.strip() for o in cors_env.split(",") if o.strip()] or DEFAULT_CORS_ORIGINS

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "MedicalPlan-Xray API. See /docs for usage."}
