// src/components/PhotoSelector.tsx
import {ChangeEvent, useRef} from 'react'
import {Button} from "@/components/ui/button.tsx";

type Props = {
    onSelect: (uri: string, type: string) => void
    readyToUploadFile: boolean
    setReadyToUploadFile: (v: boolean) => void
    handleUploadCallback: () => void
}

export default function PhotoSelector({
  onSelect,
  readyToUploadFile,
  setReadyToUploadFile,
  handleUploadCallback,
}: Readonly<Props>) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const uri = URL.createObjectURL(file)
        const mime = file.type
        onSelect(uri, mime)
        setReadyToUploadFile(true)
    }

    return (
        <div className="flex flex-col items-center gap-2 pb-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            {!readyToUploadFile && (
                <Button
                    onClick={() => fileInputRef.current?.click()}
                >
                    Choose file
                </Button>
            )}

            {readyToUploadFile && (
                <Button
                    onClick={handleUploadCallback}
                >
                    Upload
                </Button>
            )}
        </div>
    )
}
