import {NavigationMenu, NavigationMenuItem, NavigationMenuLink} from "@radix-ui/react-navigation-menu";
import {Link} from "@tanstack/react-router";
import {navItems} from "@nav/items";
import {cn} from "@/lib/utils.ts";

const Navigation = () => {
    return (
        <NavigationMenu className="h-full flex items-center space-x-2">
            {navItems.map(({path, link, icon: Icon,}) => {
                return (
                    <NavigationMenuItem key={path}>
                        <NavigationMenuLink asChild>
                            <Link
                                to={path}
                                activeProps={{ className: `font-bold link-item` }}
                                className={cn(
                                    "group w-full flex items-center justify-between gap-4 p-2 dark:text-accent-foreground [&_svg]:size-5 [&_svg]:shrink-0 relative",
                                    "rounded-lg ",
                                )}
                            >
                                {link} {Icon && <Icon className="group-[.link-item]:text-indigo-500" size={20}/>}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )
            })}
        </NavigationMenu>
    )
}

export default Navigation