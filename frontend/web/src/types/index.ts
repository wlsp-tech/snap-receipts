import {PropsWithChildren, ReactNode} from "react";


export type Theme = "dark" | "light" | "system"

export type ThemeProviderProps = {
    children: React.ReactNode
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