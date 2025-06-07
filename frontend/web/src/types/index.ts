import {PropsWithChildren, ReactNode} from "react";
import {fetchCurrentUser} from "@/features/auth";


export type Theme = "dark" | "light" | "system"

export type ThemeProviderProps = {
    children: ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export interface ILayoutContainer extends PropsWithChildren {
    className?: string;
}

export type AuthUserProps = Awaited<ReturnType<typeof fetchCurrentUser>>

export interface AuthContextType {
    user: AuthUserProps | null
    isAuthenticated: boolean
    setUser: (user: AuthUserProps | null) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
}

export interface FormWrapperProps {
    children: ReactNode
    mode: "sign-up" | "login"
    headerLabel: string
    showSocial?: boolean
    className?: string
}


export interface LoginPayload {
    email: string;
    password: string;
}

export interface UserDto {
    nameOfUser: string;
    email: string;
    receiptIds: string[];
}

export type NavigationProps = {
    currentUser?: UserDto | null,
    isMounted: boolean
}

export type UserAvatarProps = {
    nameOfUser: string;
    onLogout?: () => void;
    btnClassName?: string;
};

export interface ReceiptProps {
    id: string;
    uuid: string;
    imageUri: string;
    createdAt: string
}

export type GridLayoutProps = {
    children: ReactNode;
    className?: string;
    gap?: string;
    gridCols: Partial<{
        base: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl'?: number;
    }>
}
