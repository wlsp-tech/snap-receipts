import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";
import {Outlet} from "@tanstack/react-router";
import {ThemeProvider} from "@/providers/theme-provider.tsx";
import {Footer, Header} from "@/components/layout";

const RootLayout = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Header/>
            <main className={"flex flex-col flex-1 relative p-8 mt-16 h-full"}>
                <Outlet/>
            </main>
            <Footer />
            <TanStackRouterDevtools/>
        </ThemeProvider>
    )
}

export default RootLayout;