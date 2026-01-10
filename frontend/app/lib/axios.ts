import axios from "axios";
import { useRouter } from "next/router";

const router = useRouter();

const api = axios.create({
    baseURL: "http://localhost:2000",
    headers: {"Content-Type" : "application/json"}
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;