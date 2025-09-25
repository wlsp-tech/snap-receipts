import {useEffect, useRef} from "react";
import lottie, {AnimationItem} from "lottie-web";
import animationData from "../../assets/lottie/file-scanning.json";
import {cn} from "@/lib/utils.ts";

export default function ScanningFileAnimation({ className }: Readonly<{className?: string}>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationInstance = useRef<AnimationItem | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (animationInstance.current) {
            animationInstance.current.destroy();
        }

        animationInstance.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
        });

    }, []);

    return <div ref={containerRef} className={cn("w-full h-full", className)} />;
}
