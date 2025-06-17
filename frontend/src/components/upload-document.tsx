import { useEffect, useState } from "react";
import { uploadReceipt } from "@/features/receipt/service/receipt-service";
import { StatusType, UploadDocumentProps, OCRResult } from "@/types";
import {toast} from "sonner";
import {useNavigate} from "@tanstack/react-router";
import {DocumentSelector, ImageCompressor, LayoutContainer, UploadStatusAnimation} from "@/components";

export default function UploadDocument({
   token,
   uriFile,
   onUploadSuccess,
   onCancel,
    tokenPage
}: Readonly<UploadDocumentProps>) {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [compressedUri, setCompressedUri] = useState<string | null>(null);
    const [readyToUploadFile, setReadyToUploadFile] = useState<boolean>(false);
    const [status, setStatus] = useState<StatusType>(StatusType.ERROR);
    const [formValues, setFormValues] = useState<OCRResult>({
        company: "",
        amount: "",
        date: "",
        category: ""
    });
    const navigate = useNavigate();

    const handleSelect = (uri: string) => {
        setFileUri(uri);
        setStatus(StatusType.IDLE);
        setReadyToUploadFile(false);
    };

    const handleCancel = () => {
        setFileUri(null);
        setCompressedUri(null);
        setReadyToUploadFile(false);
        setStatus(StatusType.IDLE);
        onCancel?.();
    };

    const handleUpload = async () => {
        setStatus(StatusType.LOADING);
        if (!compressedUri || !token) return;

        const authToken = Array.isArray(token) ? token[0] : token;

        try {
            const normalizedAmount = formValues.amount
                .replace(",", ".")
                .replace(/[^\d.]/g, "");

            const parts = formValues.date.split(".");
            const normalizedDate =
                parts.length === 3
                    ? `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`
                    : formValues.date;

            await uploadReceipt(
                compressedUri,
                authToken,
                formValues.company,
                normalizedAmount,
                normalizedDate,
                formValues.category,

            );

            setFileUri(null);
            setCompressedUri(null);
            setReadyToUploadFile(false);
            setStatus(StatusType.SUCCESS);

            setTimeout(() => {
                onUploadSuccess?.();
                if(tokenPage && status === StatusType.IDLE) {
                    navigate({ to: "/dashboard" });
                }
            }, 3500);
        } catch {
            toast.error("Upload failed. Try again.");
            setStatus(StatusType.ERROR);

            setTimeout(() => {
                setStatus(StatusType.IDLE);
            }, 3500);
        }
    };

    useEffect(() => {
        if (uriFile) {
            const objectUrl = URL.createObjectURL(uriFile);
            handleSelect(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [uriFile]);

    return (
        <LayoutContainer className="flex flex-col md:flex-row w-full mx-auto my-16 lg:my-0 h-full items-center justify-center space-y-4">
            <div className="w-full lg:max-w-4/12 flex flex-col items-center justify-center relative m-0">
                <UploadStatusAnimation status={status} />

                {status === StatusType.SUCCESS && (
                    <p className="animate-in mt-4">
                        Document uploaded successfully.
                    </p>
                )}

                {status === StatusType.ERROR && (
                    <p className="animate-in mt-4">Upload failed. Please try again.</p>
                )}

                {status === StatusType.IDLE && (
                    <div className="w-[210px] aspect-[210/297]">
                        <ImageCompressor
                            uri={fileUri}
                            setCompressedUri={setCompressedUri}
                            setReadyToUploadFile={setReadyToUploadFile}
                        />
                    </div>
                )}
            </div>

            {status === StatusType.IDLE && (
                <DocumentSelector
                    fileUri={fileUri}
                    setFileUri={setFileUri}
                    onSelect={handleSelect}
                    onCancel={handleCancel}
                    readyToUploadFile={readyToUploadFile}
                    setReadyToUploadFile={setReadyToUploadFile}
                    handleUploadCallback={handleUpload}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
            )}
        </LayoutContainer>
    );
}
