import {useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {useNavigate} from "@tanstack/react-router";
import {useQuery} from '@tanstack/react-query';
import {getReceipts, uploadReceipt} from "@/features/receipt/service/receipt-service";
import {OCRResult, ReceiptProps, StatusType, UploadDocumentProps} from "@/types";
import {
    Button,
    DocumentSelector,
    ImageCompressor,
    LayoutContainer,
    ScanningFileAnimation,
    UploadStatusAnimation
} from "@/components";
import {cn} from "@/lib/utils";

const statusMessages: Partial<Record<StatusType, string>> = {
    [StatusType.SUCCESS]: "Document uploaded successfully.",
    [StatusType.ERROR]: "Upload failed. Please try again.",
};

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
    const [status, setStatus] = useState<StatusType>(StatusType.IDLE);
    const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<OCRResult>({
        company: "",
        amount: "",
        date: "",
        category: ""
    });
    const navigate = useNavigate();

    const {refetch: refetchReceipts} = useQuery<ReceiptProps[]>({
        queryKey: ['receipts'],
        queryFn: getReceipts,
        staleTime: 1000 * 60 * 30,
    });

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

    const triggerFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
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
            refetchReceipts();

            setTimeout(() => {
                onUploadSuccess?.();
                if (tokenPage && status === StatusType.IDLE) {
                    navigate({to: "/dashboard"});
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
        <LayoutContainer
            className="flex flex-col md:flex-row w-full mx-auto my-16 lg:my-0 h-full items-center justify-center space-y-4">
            <div
                className="w-full md:max-w-4/12 lg:max-w-5/12 xl:max-w-4/12 flex flex-col items-center justify-center relative m-0">
                <UploadStatusAnimation status={status}/>

                <p className="mt-4 text-center relative w-full min-h-[1.5rem]">
                    <span
                        className={cn(
                            "absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out",
                            statusMessages[status] && "opacity-100"
                        )}>{statusMessages[status]}
                    </span>
                </p>

                {status === StatusType.IDLE && (
                    <div className="flex flex-col items-center justify-center mb-8">
                        {loading && (
                            <div
                                className="w-[210px] aspect-[210/297] p-4 bg-[#EAEAEA] rounded-md flex items-center justify-center">
                                <ScanningFileAnimation />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <div className="w-[210px] aspect-[210/297]">
                                    <ImageCompressor
                                        uri={fileUri}
                                        setCompressedUri={setCompressedUri}
                                        setReadyToUploadFile={setReadyToUploadFile}
                                    />
                                </div>
                                <Button
                                    className="mt-6"
                                    onClick={triggerFileSelect}
                                    disabled={loading}
                                    variant={ocrResult ? "outline" : "default"}
                                >
                                    {ocrResult ? "Change file" : "Select file"}
                                </Button>
                            </>
                        )}
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
                    setOcrResult={setOcrResult}
                    fileInputRef={fileInputRef}
                    loading={loading}
                    setLoading={setLoading}
                />
            )}
        </LayoutContainer>
    );
}
