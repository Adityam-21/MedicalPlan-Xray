import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export async function predictMedicalPlan(data) {
  const response = await API.post("/predict", data);
  return response.data;
}

export async function getModelInfo() {
  const response = await API.get("/model");
  return response.data;
}

export default API;
