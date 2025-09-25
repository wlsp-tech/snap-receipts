import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter} from '@tanstack/react-router'
import './index.css'
import {routeTree} from './routeTree.gen'
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient.ts";
//import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "sonner";
import {useAuth} from "@/features/auth/hooks";
import {AuthProvider} from "@/providers/auth-provider";
import {RouterWithContext} from "@/router-with-context";

export const router = createRouter({
    routeTree,
    basepath: '/',
    defaultPreload: 'intent',
    context: {
        auth: undefined!,
    },
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
        context: {
            auth: ReturnType<typeof useAuth>
        }
    }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RouterWithContext />
                    <Toaster position={"bottom-center"} richColors />
                </AuthProvider>
            </QueryClientProvider>
        </StrictMode>,
    )
}