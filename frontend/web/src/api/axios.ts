import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

// Interceptor für CSRF-Token
api.interceptors.request.use((config) => {
    const csrfToken = Cookies.get("XSRF-TOKEN");

    /**
     * if (import.meta.env.DEV) {
     *         console.log("[Axios CSRF Debug]");
     *         console.log("→ XSRF-TOKEN from cookie:", csrfToken);
     *         console.log("→ Sending to:", config.url);
     *         console.log("→ Headers before:", config.headers);
     *     }
     */

    if (csrfToken && config.headers) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return config;
});

export default api;
