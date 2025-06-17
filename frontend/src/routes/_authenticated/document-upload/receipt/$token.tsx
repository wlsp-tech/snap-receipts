import {useEffect, useState} from "react";
import {createFileRoute, useParams} from '@tanstack/react-router';
import LayoutContainer from "@/components/shared/layout-container";
import UploadDocument from "@/components/upload-document";
import {queryClient} from "@/lib/queryClient";
import {loginWithToken} from "@/features/auth/service/auth-service";
import UploadStatusAnimation from "@/components/lottie-status.tsx";
import {StatusType} from "@/types";

export const Route = createFileRoute(
    '/_authenticated/document-upload/receipt/$token'
)({
    component: RouteComponent,
});

function RouteComponent() {
    const { token } = useParams({ from: "/_authenticated/document-upload/receipt/$token" });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        (async () =>{
            try {
                if (!token) {
                    setError("Not token found!");
                    setLoading(false);
                    return;
                }

                const currentUser = queryClient.getQueryData(['currentUser']);
                if (!currentUser) {
                    await loginWithToken(token);
                }
                setIsLoggedIn(true);
            } catch (e) {
                if (e instanceof Error) {
                    setError(`Login failed: ${e.message}`);
                }
            } finally {
                setLoading(false);
            }
        }
        )();
    }, [token]);

    return (
        <LayoutContainer className="flex flex-1 justify-items-center items-center gap-2 flex-col">
            {token && isLoggedIn && !loading && !error && <UploadDocument tokenPage={true} token={token} />}
            {loading && <UploadStatusAnimation status={StatusType.LOADING} />}
            {error && <p>Error: {error}</p>}
            {!isLoggedIn && <p>You are not logged in.</p>}
        </LayoutContainer>
    );
}
