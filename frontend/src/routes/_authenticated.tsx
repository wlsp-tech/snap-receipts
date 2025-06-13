import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { queryClient } from '@/lib/queryClient';
import { fetchCurrentUser, loginWithToken } from '@/features/auth';
import {toast} from "sonner";

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ location }) => {
        let user = queryClient.getQueryData(['currentUser']);

        if (user) return;

        try {
            user = await fetchCurrentUser();
            queryClient.setQueryData(['currentUser'], user);
            return;
        } catch {
            const tokenMatch = RegExp(/\/receipt\/([^/]+)/).exec(location.pathname);
            const token = tokenMatch?.[1];

            if (token) {
                try {
                    await loginWithToken(token);
                    user = await fetchCurrentUser();
                    if (user) {
                        queryClient.setQueryData(['currentUser'], user);
                        return;
                    }
                } catch(e) {
                    if(e instanceof Error) {
                        toast.error(`Login failed. Error: ${e.message}`)
                    }
                    toast.error("Unknown error while trying to login.")
                }
            }

            throw redirect({
                to: '/auth/login',
                search: { redirect: location.href },
            });
        }
    },
    component: () => <Outlet />,
});
