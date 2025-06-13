import { useEffect } from "react";
import FilePreview from "@/components/file-preview";
import {ImageCompressorProps} from "@/types";

export default function ImageCompressor({
    uri,
    setCompressedUri,
    setReadyToUploadFile,
}: Readonly<ImageCompressorProps>) {
    useEffect(() => {
        if (!uri) return;
        compressImage(uri, setCompressedUri, setReadyToUploadFile);
    }, [uri, setCompressedUri, setReadyToUploadFile]);

    return <FilePreview uri={uri} />;
}

function compressImage(
    uri: string,
    setCompressedUri: (uri: string | null) => void,
    setReadyToUploadFile: (ready: boolean) => void
) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = uri;
    img.onload = () => handleImageLoad(img, setCompressedUri, setReadyToUploadFile);
}

function handleImageLoad(
    img: HTMLImageElement,
    setCompressedUri: (uri: string | null) => void,
    setReadyToUploadFile: (ready: boolean) => void
) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxWidth = 1024;
    const scale = maxWidth / img.width;
    canvas.width = maxWidth;
    canvas.height = img.height * scale;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
        (blob) => handleBlob(blob, setCompressedUri, setReadyToUploadFile),
        "image/jpeg",
        0.5
    );
}

function handleBlob(
    blob: Blob | null,
    setCompressedUri: (uri: string | null) => void,
    setReadyToUploadFile: (ready: boolean) => void
) {
    if (!blob) return;

    const compressedURL = URL.createObjectURL(blob);
    setCompressedUri(compressedURL);
    setReadyToUploadFile(true);
}