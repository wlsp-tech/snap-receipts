import {NavigationMenu, NavigationMenuItem, NavigationMenuLink} from "@radix-ui/react-navigation-menu";
import {Link} from "@tanstack/react-router";
import {navItems} from "@nav/items";
import {cn} from "@/lib/utils.ts";
import {NavigationProps} from "@/types";

const Navigation = ({ isMounted, currentUser }: NavigationProps) => {
    const filteredItems = navItems.filter(item => {
        return item.public ?? !!currentUser
    })

    return (
        <NavigationMenu className="h-full flex items-center space-x-1">
            {filteredItems.map(({ path, link, icon: Icon }) => (
                <NavigationMenuItem key={path}>
                    <NavigationMenuLink asChild>
                        <Link
                            to={path}
                            activeProps={{ className: `font-bold link-item border-b dark:border-b-white` }}
                            className={cn(
                                "group w-full flex items-center justify-between gap-1 p-2 dark:text-accent-foreground [&_svg]:size-5 [&_svg]:shrink-0 relative",
                                "hover:text-indigo-400 transition-colors opacity-100",
                                path !== "/" && "opacity-0 duration-opacity-700", isMounted && "opacity-100 "
                            )}
                        >
                            {link} {Icon && <Icon className="group-[.link-item]:text-indigo-500" size={20} />}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
        </NavigationMenu>
    )
}

export default Navigation