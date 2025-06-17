import {PropsWithChildren, ReactNode} from "react";
import {fetchCurrentUser} from "@/features/auth";
import {ColumnDef} from "@tanstack/react-table";
import * as React from "react";


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
    company: string;
    amount: string;
    date: string;
    category: string;
    hasFilterBtn?: boolean
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

export type TableGenProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean
};

export type DeleteCellProps = {
    deleteCallback: () => Promise<void> | void;
};

export type ImageProps = {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    loading?: "lazy" | "eager";
};

export type ImageCompressorProps = {
    uri: string | null;
    setCompressedUri: (uri: string | null) => void;
    setReadyToUploadFile: (b: boolean) => void;
};

export interface OCRResult {
    date: string;
    amount: string;
    company: string;
    category: string;
}

export interface DocumentSelectorProps {
    fileUri: string | null;
    setFileUri: (uri: string | null) => void;
    onSelect: (uri: string, mimeType: string) => void;
    onCancel?: () => void;
    readyToUploadFile: boolean;
    setReadyToUploadFile: (ready: boolean) => void;
    handleUploadCallback: () => void;
    formValues: OCRResult;
    setFormValues: React.Dispatch<React.SetStateAction<OCRResult>>;
}

export type uploadStatusProps = {
    status: StatusType
};

export enum StatusType {
    IDLE = "idle",
    LOADING = "loading",
    SUCCESS = "success",
    ERROR = "error"
}

export interface UploadDocumentProps {
    token: string | string[]
    uriFile?: File
    onUploadSuccess?: () => void
    onCancel?: () => void
    tokenPage?: boolean
}