import {FC, useState} from "react";
import {ImageProps} from "@/types";

const Image: FC<ImageProps> = ({
     src,
     alt,
     width,
     height,
     className = "",
     placeholder,
     style,
     loading = "lazy",
 }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            style={{
                width,
                height,
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
            className={`relative ${className}`}
        >
            {placeholder && !loaded && (
                <img
                    src={placeholder}
                    alt="placeholder"
                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-105"
                />
            )}
            <img
                src={src}
                alt={alt}
                loading={loading}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                width={width}
                height={height}
            />
        </div>
    );
};

export default Image;
