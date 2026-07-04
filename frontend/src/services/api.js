import axios from "axios";

// Change this when deploying.
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Send prediction request to the FastAPI backend.
 * Expects a payload matching PredictionRequest.
 */
export async function predictMedicalPlan(data) {
  const response = await API.post("/predict", data);
  return response.data;
}

export default API;