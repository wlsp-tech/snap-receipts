import api from "@/lib/api/axios";
import { LoginPayload, UserDto } from "@/types";
import { queryClient } from "@/lib/queryClient";

const AUTH_BASE = "/auth";

export async function loginUser(data: LoginPayload): Promise<UserDto> {
    const response = await api.post<UserDto>(`${AUTH_BASE}/login`, data);
    queryClient.setQueryData(['currentUser'], response.data);
    return response.data;
}

export async function fetchCurrentUser(): Promise<UserDto> {
    const response = await api.get<UserDto>(`${AUTH_BASE}/me`);
    queryClient.setQueryData(['currentUser'], response.data);
    return response.data;
}

export async function logoutUser() {
    await api.get(`${AUTH_BASE}/logout`);
    queryClient.clear();
}

export async function signUpUser(data: { nameOfUser: string; email: string; password: string }) {
    const response = await api.post<UserDto>(`${AUTH_BASE}/sign-up`, data, {
        withCredentials: true,
    });
    return response.data;
}

export async function loginWithToken(token: string): Promise<UserDto> {
    const response = await api.post<UserDto>(
        `${AUTH_BASE}/token-login`,
        { token },
        { withCredentials: true }
    );
    queryClient.setQueryData(['currentUser'], response.data);
    window.location.reload();
    return response.data;
}