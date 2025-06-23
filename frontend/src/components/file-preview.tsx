import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Image } from "@/components/index.ts"

interface FilePreviewProps {
    uri?: string | null
    alt?: string
    className?: string
    showDialog?: boolean
}

export default function FilePreview({
    uri,
    alt = "File preview",
    className = "",
    showDialog = true,
}: Readonly<FilePreviewProps>) {
    const [isOpen, setIsOpen] = useState(false)

    const normalizedUri = uri ?? ""

    const imageComponent = (
        <Image
            src={normalizedUri || "/placeholder.svg"}
            alt={alt}
            fallbackSrc="/placeholder.svg?height=400&width=300"
            className={`rounded-lg ${className}`}
            onError={() => console.log("Using fallback for URI:", uri)}
            objectFit="contain"
        />
    )

    if (!showDialog) {
        return imageComponent
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="cursor-pointer hover:opacity-80 transition-opacity">{imageComponent}</div>
            </DialogTrigger>
            <DialogContent className=" max-w-xl p-0 overflow-hidden">
                <DialogTitle className="p-4 pb-2 text-lg font-semibold">{alt}</DialogTitle>
                <div
                    className="relative w-full h-full flex items-center justify-center p-4 pt-0"
                >
                    <Image
                        src={normalizedUri || "/placeholder.svg"}
                        alt={alt}
                        fallbackSrc="/placeholder.svg?height=800&width=600"
                        className="w-full h-full object-contain rounded-lg"
                        priority={true}
                        objectFit="contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
