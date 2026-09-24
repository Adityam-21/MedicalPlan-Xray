import axios from "axios";

// Free hosting sleeps when idle, and waking the container can take ~60s.
// A short timeout would make a sleeping backend look like a broken one.
const COLD_START_TIMEOUT_MS = 90000;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: COLD_START_TIMEOUT_MS,
});

export async function predictMedicalPlan(data) {
  const response = await API.post("/predict", data);
  return response.data;
}

export async function getModelInfo() {
  const response = await API.get("/model");
  return response.data;
}

/**
 * Fire-and-forget wake-up call, sent when the page loads so the container is
 * already running by the time someone submits the form. Failures are ignored:
 * this is an optimisation, not a dependency.
 */
export function wakeBackend() {
  API.get("/health", { timeout: COLD_START_TIMEOUT_MS }).catch(() => {});
}

export default API;
