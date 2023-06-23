import axios from "axios";

export const api = axios.create({
  baseURL: "https://kofgvsu30l.execute-api.us-east-1.amazonaws.com",
});
