from fastapi import FastAPI

from backend.app.routes import router

from backend.app.config import API_TITLE, API_VERSION

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "Welcome to MedicalPlan-Xray API 🚀"
    }