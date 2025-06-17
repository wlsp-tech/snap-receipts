import * as React from "react";
import {useState, ChangeEvent} from "react";
import { cn } from "@/lib/utils";
import {CloudUploadIcon, Dialog, DialogDescription, DialogTitle, DialogHeader, DialogContent, UploadDocument} from "@/components";

export default function DropzoneModal({
  token,
  onUploadSuccess,
}: Readonly<{ token: string; onUploadSuccess?: () => void }>) {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            setOpen(true);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setOpen(true);
        }
    };

    return (
        <>
            <label
                htmlFor="file-upload"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                    "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors relative",
                    "flex flex-col items-center justify-center w-full h-full space-y-4"
                )}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <CloudUploadIcon className="w-12 h-12" />
                <p className="text-foreground text-sm">Drop files to upload or click to select files</p>
            </label>

            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setFile(null);
                }}
            >
                <DialogContent className="w-4xl min-h-[417px]">
                    <DialogHeader>
                        <DialogTitle>Receipt</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>{file?.name}</DialogDescription>
                    {file && (
                        <UploadDocument
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            token={token}
                            uriFile={file}
                            onUploadSuccess={() => {
                                setFile(null);
                                onUploadSuccess?.();
                            }}
                            onCancel={() => {
                                setFile(null);
                                setOpen(false);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
