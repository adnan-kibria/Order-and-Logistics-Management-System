import axios from "axios";
import { redirect } from "next/navigation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status !== 200) {
      redirect('/signin');
    }
    return Promise.reject(error);
  }
);

export default api;