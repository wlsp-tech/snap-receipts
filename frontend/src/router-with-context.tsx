import {useAuth} from "@/features/auth/hooks";
import {RouterProvider} from "@tanstack/react-router";
import {router} from "@/main.tsx";

export function RouterWithContext() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{auth}}/>
}