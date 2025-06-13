import {FC, useState} from "react";
import {ImageProps} from "@/types";
import {cn} from "@/lib/utils.ts";

const Image: FC<ImageProps> = ({
     src,
     alt,
     className,
     placeholder,
     loading = "lazy",
 }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={cn("relative w-full h-full overflow-hidden rounded-lg", className)}>
            {placeholder && !loaded && (
                <img
                    src={placeholder}
                    alt="placeholder"
                    className="absolute inset-0 w-full h-full object-cover blur-lg"
                    width={"100%"}
                    height={"100%"}

                />
            )}
            <img
                src={src}
                alt={alt}
                loading={loading}
                onLoad={() => setLoaded(true)}
                className={cn("w-full h-full transition-opacity opacity-0 duration-200",
                    loaded && "opacity-100")}
                width={"100%"}
                height={"100%"}
            />
        </div>
    );
};

export default Image;
