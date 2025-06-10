import {Outlet} from "@tanstack/react-router";
import {ThemeProvider} from "@/providers/theme-provider.tsx";
import {Footer, Header} from "@/components/layout";

const RootLayout = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Header/>
            <main className={"max-width-custom flex flex-col flex-1 relative px-2 lg:px-18 mt-16 h-full"}>
                <Outlet/>
            </main>
            <Footer />
        </ThemeProvider>
    )
}

export default RootLayout;