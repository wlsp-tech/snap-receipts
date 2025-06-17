import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SmartImageProps {
    src: string;
    alt?: string;
    className?: string;
}

export default function SmartImage({ src, alt = "", className = "" }: SmartImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={cn(
                "relative w-full max-w-sm aspect-[210/297] rounded-xl overflow-hidden shadow-md",
                className
            )}
        >
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                </div>
            )}

            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={cn(
                    "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300",
                    loaded ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
