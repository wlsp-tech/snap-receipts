import {useState} from "react";
import ImageCompressor from "@/components/image-compressor";
import UploadStatusAnimation from "@/components/lottie-status";
import {uploadReceipt} from "@/features/receipt/service/receipt-service";
import {StatusType} from "@/types";
import PhotoSelector from "@/components/photo-selector.tsx";

export default function UploadDocument({token}: Readonly<{ token: string | string[] }>) {
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [compressedUri, setCompressedUri] = useState<string | null>(null);
    const [readyToUploadFile, setReadyToUploadFile] = useState<boolean>(false);
    const [status, setStatus] = useState<StatusType>(StatusType.IDLE);

    const handleSelect = (uri: string) => {
        setFileUri(uri);
        setStatus(StatusType.IDLE);
        setReadyToUploadFile(false);
    };

    const handleUpload = async () => {
        setStatus(StatusType.LOADING);
        if (!compressedUri || !token) return;

        const authToken = Array.isArray(token) ? token[0] : token;

        try {
            await uploadReceipt(compressedUri, authToken);

            setFileUri(null);
            setCompressedUri(null);
            setReadyToUploadFile(false);
            setStatus(StatusType.SUCCESS);
        } catch {
            setStatus(StatusType.ERROR);
        }
    };

    return (
        <>
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 relative">
                <UploadStatusAnimation status={status}/>
                {status === StatusType.SUCCESS && (
                    <p className="fade-in text-center absolute bottom-28">
                        Document uploaded successfully.<br/>
                        Continue on your other device.
                    </p>
                )}
                {status === StatusType.ERROR &&
                    <p className="absolute bottom-28">Upload failed. Please try again.</p>
                }

                {status === StatusType.IDLE && (
                    <div className="w-60 aspect-[210/297]">
                        <ImageCompressor
                            uri={fileUri}
                            setCompressedUri={setCompressedUri}
                            setReadyToUploadFile={setReadyToUploadFile}
                        />
                    </div>
                )
                }
            </div>
        {status === StatusType.IDLE && (
            <PhotoSelector
                onSelect={handleSelect}
                readyToUploadFile={readyToUploadFile}
                setReadyToUploadFile={setReadyToUploadFile}
                handleUploadCallback={handleUpload}
            />
        )}
        </>
    );
}
