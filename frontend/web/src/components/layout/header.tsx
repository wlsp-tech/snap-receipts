import {ThemeToggle} from "@/components/shared/theme-toggle.tsx";
import {Navigation} from "@/components/layout";
import {Link} from "@tanstack/react-router";
import {LucideLogIn} from "lucide-react";
import {cn} from "@/lib/utils.ts";

const Header = () => {
    return (
        <header
            className="fixed top-0 left-0 h-16 w-full backdrop-blur-xl border-b-accent border-b-1 px-2 lg:px-8 shadow-lg z-50">
            <div className="max-w-screen-custom flex justify-between items-center w-full px-2 lg:px-8 h-full">
                <Navigation/>
                <div className="flex items-center space-x-4">
                    <Link
                        to={"/auth/login"}
                        activeProps={{ className: "font-bold link-item" }}
                        className={cn(
                            "group w-full flex items-center justify-between gap-4 p-2 dark:text-accent-foreground [&_svg]:size-5 [&_svg]:shrink-0 relative",
                            "rounded-lg group",
                        )}>
                        Log-In
                        <LucideLogIn className={"group-[.link-item]:text-indigo-500"}/>
                    </Link>
                    <ThemeToggle/>
                </div>
            </div>
        </header>
    )
}

export default Header;