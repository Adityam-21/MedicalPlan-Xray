from fastapi import FastAPI

from backend.app.routes import router

from backend.app.config import API_TITLE, API_VERSION

app = FastAPI(
    title=API_TITLE,
    version=API_VERSION
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "Welcome to MedicalPlan-Xray API 🚀"
    }