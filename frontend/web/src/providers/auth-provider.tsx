import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { loginUser, logoutUser, fetchCurrentUser } from "@/features/auth";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { UserDto } from "@/types";

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = queryClient.getQueryData<UserDto>(['currentUser']);
        if (cached) {
            setUser(cached);
            setLoading(false);
        } else {
            fetchCurrentUser()
                .then(setUser)
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const loggedInUser = await loginUser({ email, password });
            setUser(loggedInUser);
            toast.success(`Welcome back, ${loggedInUser.nameOfUser}`);
        } catch (error) {
            toast.error("Login failed");
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
            queryClient.removeQueries({ queryKey: ['currentUser'] });
            toast.info("You'll be back!");
        } catch (error) {
            if(error instanceof Error) {
                toast.error(`Logout failed! Error: ${error.message}`);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
