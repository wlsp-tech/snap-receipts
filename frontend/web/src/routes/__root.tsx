import {createRootRouteWithContext} from '@tanstack/react-router'
import {RootLayout} from "@/layouts";
import {useAuth} from "@/features/auth/hooks";

export const Route = createRootRouteWithContext<{
    auth: ReturnType<typeof useAuth>
}>()({
    component: () => <RootLayout />,
})