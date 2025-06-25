import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Ya incluye /api
  withCredentials: true,
});

export default API;