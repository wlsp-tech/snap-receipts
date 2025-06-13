import {FC} from "react";
import {ILayoutContainer} from "@/types";
import {cn} from "@/lib/utils.ts";

const LayoutContainer: FC<ILayoutContainer> = ({ children, className}) => {
    return (
        <div className={cn("w-full h-full flex-1 relative", className)}>
            {children}
        </div>
    )
}

export default LayoutContainer;