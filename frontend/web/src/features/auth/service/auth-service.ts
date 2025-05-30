import api from "@/api/axios";
import { LoginPayload } from "@/types";
import { queryClient } from "@/lib/queryClient";

const AUTH_BASE = "/auth";

export async function loginUser(data: LoginPayload) {
    const response = await api.post(`${AUTH_BASE}/login`, data, {
        withCredentials: true
    });
    queryClient.setQueryData(['currentUser'], response.data);
    return response.data;
}

export async function fetchCurrentUser() {
    try {
        const response = await api.get(`${AUTH_BASE}/me`, {
            withCredentials: true
        });
        queryClient.setQueryData(['currentUser'], response.data);
        return response.data;
    } catch (error) {
        queryClient.removeQueries({ queryKey: ['currentUser']});
        throw error;
    }
}


export async function logoutUser() {
    try {
        const response = await api.get(`${AUTH_BASE}/logout`);
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
}

export async function signUpUser(data: { nameOfUser: string; email: string; password: string }) {
    const response = await api.post(`${AUTH_BASE}/sign-up`, data, {
        withCredentials: true
    });
    return response.data;
}