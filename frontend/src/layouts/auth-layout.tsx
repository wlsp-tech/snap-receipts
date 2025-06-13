import {cn} from "@/lib/utils.ts";
import LayoutContainer from "@/components/shared/layout-container.tsx";
import {ReactNode} from "react";

const AuthLayout = ({className, children} : {className?: string, children: ReactNode}) => {
    return (
        <LayoutContainer className={cn("flex items-center", className)}>
            {children}
        </LayoutContainer>
    )
}

export default AuthLayout;