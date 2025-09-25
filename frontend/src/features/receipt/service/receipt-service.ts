import api from "@/lib/api/axios.ts";
import {ReceiptProps} from "@/types";
import axios from "axios";
import {toast} from "sonner";

const RECEIPT_BASE_URL = "/snap-receipts"

export const getReceipts = async () => {
    try {
        const response = await api.get<ReceiptProps[]>(`${RECEIPT_BASE_URL}/receipts`, {
            withCredentials: true,
        });
        return response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error ?? error.message;
            toast.error(`Failed to load receipts: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to load receipts: ${error.message}`);
        } else {
            toast.error(`Failed to load receipts: Unknown error`);
        }
        throw error;
    }
};

export async function fetchUploadToken() {
    try {
        const response = await api.post(`${RECEIPT_BASE_URL}/token/generate-upload-token`, null, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error ?? error.message;
            toast.error(`Failed to generate upload token: ${message}`);
        } else if (error instanceof Error) {
            toast.error(`Failed to generate upload token: ${error.message}`);
        }
        throw error;
    }
}

export async function uploadReceipt(
    compressedUri: string,
    token: string,
    company: string,
    amount: string,
    date: string,
    category: string,
) {
    if (!compressedUri || !token) throw new Error("Missing image or token");

    try {
        const response = await fetch(compressedUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", blob, "upload.png");
        formData.append("token", token);
        formData.append("company", company);
        formData.append("amount", amount);
        formData.append("date", date);
        formData.append("category", category);

        await api.post(`${RECEIPT_BASE_URL}/token/upload-by-token`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
    } catch (error) {
        toast.error("Upload failed: Unknown error");
        throw error;
    }
}

export async function deleteReceipt(receiptId: string) {
    const deletePromise = api.delete(`${RECEIPT_BASE_URL}/${receiptId}`);

    toast.promise(deletePromise, {
        loading: "Deleting receipt...",
        success: "Receipt deleted!",
        error: (error: unknown) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error ?? error.message;
                return `Failed to delete receipt: ${message}`;
            } else if (error instanceof Error) {
                return `Failed to delete receipt: ${error.message}`;
            } else {
                return "Failed to delete receipt: Unknown error";
            }
        },
    });

    return deletePromise;
}