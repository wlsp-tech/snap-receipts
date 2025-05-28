import {ReactNode, useEffect, useState} from "react"
import { AuthContext } from "@/context/auth-context"
import { loginUser, logoutUser, fetchCurrentUser } from "@/features/auth"
import { queryClient } from "@/lib/queryClient"
import { toast } from "sonner"
import {UserDto} from "@/types"

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [user, setUser] = useState<UserDto | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cached = queryClient.getQueryData<UserDto>(['currentUser']);
        if (cached) {
            setUser(cached);
            setLoading(false);
        } else {
            fetchCurrentUser()
                .then(user => setUser(user))
                .catch(() => setUser(null))
                .finally(() => setLoading(false));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await loginUser({ email, password })
        if (res.success) {
            setUser(res.data)
            toast.success(`Welcome back, ${res.nameOfUser}`)
        } else {
            throw new Error('Login failed')
        }
    }

    const logout = async () => {
        await logoutUser()
        setUser(null)
        queryClient.removeQueries({ queryKey: ['currentUser'] })
        toast.info(`You'll be back!`)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
