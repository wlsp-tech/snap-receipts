import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken && config.headers) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return config;
});

export default api;
