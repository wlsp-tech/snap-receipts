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
                // Lade-Loop: Frames 0–120 in Endlosschleife
                animationRef.current.playSegments([0, 120], true);
                break;

            case "success":
                // Success-Loop: Frames 238–423 in Endlosschleife
                animationRef.current.playSegments([238, 423], true);
                break;

            case "error":
                // Error-Loop: Frames 657–847 in Endlosschleife
                animationRef.current.playSegments([657, 847], false);
                break;

            default:
                // idle: Animation stoppen
                animationRef.current.stop();
                break;
        }
    }, [status]);

    if (status === "idle") return null;

    return (
        <Lottie
            lottieRef={animationRef}
            animationData={animationData}
            loop={true}
            autoplay={false}
            style={{ width: 200, height: 200 }}
        />
    );
}
