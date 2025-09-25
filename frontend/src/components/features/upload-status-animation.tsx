import {useEffect, useRef} from "react";
import lottie, {AnimationItem} from "lottie-web";
import animationData from "../../assets/lottie/upload-status.json";
import {StatusType, uploadStatusProps} from "@/types";

export default function UploadStatusAnimation({ status }: Readonly<uploadStatusProps>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationInstance = useRef<AnimationItem | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        if (animationInstance.current) {
            animationInstance.current.destroy();
        }

        const anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: false,
            animationData,
        });

        animationInstance.current = anim;

        const loopHandler = () => {
            anim.playSegments([0, 120], true);
        };

        if (status === StatusType.LOADING) {
            anim.addEventListener("complete", loopHandler);
            anim.playSegments([0, 120], true);
        } else {
            anim.removeEventListener("complete", loopHandler);

            if (status === StatusType.SUCCESS) {
                anim.playSegments([238, 390], true);
            } else if (status === StatusType.ERROR) {
                anim.playSegments([657, 819], true);
            }
        }

        return () => {
            anim.removeEventListener("complete", loopHandler);
            anim.destroy();
        };
    }, [status]);

    if (status === StatusType.IDLE) return null;

    return <div ref={containerRef} className="w-44 h-44" />;
}
