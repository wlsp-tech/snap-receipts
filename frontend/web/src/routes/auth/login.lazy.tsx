import {createLazyFileRoute} from '@tanstack/react-router'
import {LoginForm} from "@/features/auth";
import {FormWrapper} from "@/features/auth/components/form-wrapper.tsx";
import {AuthLayout} from "@/layouts";

export const Route = createLazyFileRoute('/auth/login')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthLayout className="flex items-center">
            <FormWrapper
                mode={"login"}
                className="flex flex-1 items-center"
                headerLabel={'Welcome Back!'}
            >
                <LoginForm/>
            </FormWrapper>
        </AuthLayout>
    )
}