FROM python:3.12-slim

# Fail fast, no .pyc files, unbuffered logs for the platform's log viewer.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY models ./models

# Run as a non-root user.
RUN useradd --create-home --uid 1000 appuser && chown -R appuser /app
USER appuser

# Hosts (Render, Fly, Hugging Face Spaces) assign the port through $PORT;
# 8000 is the local default. Shell form so the variable is expanded.
ENV PORT=8000
EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
