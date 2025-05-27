import api from "@/api/axios";
import { LoginPayload } from "@/types";

const AUTH_BASE = "/auth";

export async function loginUser(data: LoginPayload) {
    const response = await api.post(`${AUTH_BASE}/login`, data);
    return response.data;
}

export async function fetchCurrentUser() {
    const response = await api.get(`${AUTH_BASE}/me`);
    return response.data;
}

export async function logoutUser() {
    const response = await api.post(`${AUTH_BASE}/logout`);
    return response.data;
}

export async function signUpUser(data: { nameOfUser: string; email: string; password: string }) {
    const response = await api.post(`${AUTH_BASE}/sign-up`, data);
    return response.data;
}
