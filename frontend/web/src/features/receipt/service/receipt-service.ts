import api from "@/api/axios.ts";
import { ReceiptProps } from "@/types";
import axios from "axios";
import { toast } from "sonner";

export const getReceipts = async () => {
    try {
        const response = await api.get<ReceiptProps[]>("/snap-receipts");
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
