import api from "@/api/axios.ts";
import { ReceiptProps } from "@/types";
import axios from "axios";
import { toast } from "sonner";

const RECEIPT_BASE_URL = "/snap-receipts"

export const getReceipts = async () => {
    try {
        const response = await api.get<ReceiptProps[]>(`${RECEIPT_BASE_URL}/receipts`, {
            withCredentials: true,
        });
        return response.data;
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