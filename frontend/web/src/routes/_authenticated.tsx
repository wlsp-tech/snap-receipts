import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'

import { queryClient } from '@/lib/queryClient';
import { fetchCurrentUser } from '@/features/auth';

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ location }) => {
        let user = queryClient.getQueryData(['currentUser']);

        if (!user) {
            try {
                user = await fetchCurrentUser();
                queryClient.setQueryData(['currentUser'], user);

            } catch {
                throw redirect({
                    to: '/auth/login',
                    search: { redirect: location.href },
                });
            }
        }

        if (!user) {
            throw redirect({
                to: '/auth/login',
                search: { redirect: location.href },
            });
        }
    },
    component: () => <Outlet />,
});

