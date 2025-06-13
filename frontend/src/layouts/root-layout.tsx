import {Outlet, useLocation} from "@tanstack/react-router";
import {ThemeProvider} from "@/providers/theme-provider.tsx";
import {Footer, Header} from "@/components/layout";
import {cn} from "@/lib/utils.ts";

const RootLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const isReceiptPath = currentPath.startsWith("/document-upload/receipt");
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Header/>
            <main className={cn("max-width-custom flex flex-col flex-1 relative px-4 lg:px-18 pt-16 h-full md:scrollbar-default scrollbar-hide", isReceiptPath && "flex-none mt-0 h-[calc(100dvh-4rem)]")}>
                {isReceiptPath && (<div className="h-16"/>)}
                <Outlet/>
            </main>
            <Footer />
        </ThemeProvider>
    )
}

export default RootLayout;