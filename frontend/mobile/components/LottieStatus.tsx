import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie/upload-status.json";

type Props = {
    status: "idle" | "loading" | "success" | "error";
};

export default function UploadStatusAnimation({ status }: Props) {
    const animationRef = useRef<any>(null);

    useEffect(() => {
        if (!animationRef.current) return;

        switch (status) {
            case "loading":
                animationRef.current.playSegments([0, 120], true);
                break;

            case "success":
                animationRef.current.playSegments([238, 423], false);
                animationRef.current.playSegments([238, 390], false);
                break;

            case "error":
                animationRef.current.playSegments([657, 847], false);
                animationRef.current.playSegments([657, 819], false);
                break;

            default:
                animationRef.current.stop();
                break;
        }
    }, [status]);

    if (status === "idle") return null;

    return (
        <Lottie
            lottieRef={animationRef}
            animationData={animationData}
            loop={false}
            autoplay={false}
            style={{ width: 200, height: 200 }}
        />
    );
}
