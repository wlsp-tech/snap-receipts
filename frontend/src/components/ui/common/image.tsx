"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils.ts"
import { Loader2, ImageOff } from "lucide-react"

interface SmartImageProps {
    src: string
    alt?: string
    className?: string
    aspectRatio?: string
    fallbackSrc?: string
    onLoad?: () => void
    onError?: () => void
    priority?: boolean
    sizes?: string
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export default function SmartImage({
   src,
   alt = "",
   className = "",
   aspectRatio = "210/297",
   fallbackSrc,
   onLoad,
   onError,
   priority = false,
   sizes,
   objectFit = "cover",
}: Readonly<SmartImageProps>) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const [currentSrc, setCurrentSrc] = useState(src)

    const handleLoad = useCallback(() => {
        setLoaded(true)
        setError(false)
        onLoad?.()
    }, [onLoad])

    const handleError = useCallback(() => {
        setError(true)
        setLoaded(false)
        onError?.()

        // Try fallback image if available and not already using it
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
        }
    }, [fallbackSrc, currentSrc, onError])

    const objectFitClass = {
        cover: "object-cover",
        contain: "object-contain",
        fill: "object-fill",
        none: "object-none",
        "scale-down": "object-scale-down",
    }[objectFit]

    return (
        <div
            className={cn("relative w-full max-w-sm rounded-xl overflow-hidden shadow-md bg-gray-100", className)}
            style={{ aspectRatio }}
        >
            {/* Loading State */}
            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageOff className="w-8 h-8" />
                        <span className="text-xs text-center px-2">Failed to load image</span>
                    </div>
                </div>
            )}

            {/* Image */}
            <img
                src={currentSrc || "/placeholder.svg"}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                sizes={sizes}
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    "absolute inset-0 w-full h-full transition-opacity duration-300",
                    objectFitClass,
                    loaded && !error ? "opacity-100" : "opacity-0",
                )}
                decoding="async"
            />
        </div>
    )
}
