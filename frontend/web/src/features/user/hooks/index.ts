import {useQuery} from "@tanstack/react-query";
import {fetchCurrentUser} from "@/features/auth";

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
    });
}
