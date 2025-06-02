// features/auth.ts

import api from "@/api/axios";
import { LoginPayload, UserDto } from "@/types";
import { queryClient } from "@/lib/queryClient";

const AUTH_BASE = "/auth";

export async function loginUser(data: LoginPayload): Promise<UserDto> {
    const response = await api.post<UserDto>(`${AUTH_BASE}/login`, data, {
        withCredentials: true,
    });
    queryClient.setQueryData(['currentUser'], response.data);
    return response.data;
}

export async function fetchCurrentUser(): Promise<UserDto> {
    const response = await api.get<UserDto>(`${AUTH_BASE}/me`, {
        withCredentials: true,
    });
    queryClient.setQueryData(['currentUser'], response.data);
    return response.data;
}

export async function logoutUser() {
    await api.get(`${AUTH_BASE}/logout`);
    queryClient.removeQueries({ queryKey: ['currentUser'] });
}

export async function signUpUser(data: { nameOfUser: string; email: string; password: string }) {
    const response = await api.post<UserDto>(`${AUTH_BASE}/sign-up`, data, {
        withCredentials: true,
    });
    return response.data;
}
