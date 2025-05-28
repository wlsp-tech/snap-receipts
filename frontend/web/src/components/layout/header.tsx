import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Navigation } from "@/components/layout"
import { Link, useNavigate } from "@tanstack/react-router"
import { LucideLogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks"
import { UserAvatarAction } from "@/features/user"

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMounted(true)
        }, 50)

        return () => clearTimeout(timeout)
    }, [])
    const normalizedUser = user?.data ?? user

    return (
        <header
            className="fixed top-0 left-0 h-16 w-full backdrop-blur-xl border-b-accent border-b px-2 lg:px-8 shadow-lg z-50 transition-opacity duration-700"
        >
            <div className="max-w-screen-custom flex justify-between items-center w-full px-2 lg:px-8 h-full">
                <Navigation currentUser={user} isMounted={mounted} />
                <div className="flex items-center space-x-4">
                    {!user ? (
                        <Link
                            to="/auth/login"
                            activeProps={{ className: "font-bold link-item" }}
                            className={cn(
                                "group w-full flex items-center justify-between gap-4 p-2 dark:text-accent-foreground [&_svg]:size-5 [&_svg]:shrink-0 relative",
                                "rounded-lg hover:text-indigo-400 transition-colors"
                            )}
                        >
                            Log-In
                            <LucideLogIn className="group-[.link-item]:text-indigo-500" />
                        </Link>
                    ) : (
                        <UserAvatarAction
                            btnClassName={cn("opacity-0", mounted && "opacity-100 duration-opacity-700")}
                            nameOfUser={normalizedUser?.nameOfUser}
                            onLogout={async () => {
                                await logout()
                                await navigate({ to: "/auth/login" })
                            }}
                        />
                    )}

                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

export default Header
