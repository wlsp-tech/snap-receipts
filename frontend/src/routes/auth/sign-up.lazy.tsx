import {createLazyFileRoute} from '@tanstack/react-router'
import {FormWrapper} from "@/features/auth/components/form-wrapper";
import {SignUpForm} from "@/features/auth";
import {AuthLayout} from "@/layouts";

export const Route = createLazyFileRoute('/auth/sign-up')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <AuthLayout className="flex items-center">
            <FormWrapper
                mode={"sign-up"}
                headerLabel={"Come to the Snap side of the Receipts!"}>
                <SignUpForm/>
            </FormWrapper>
        </AuthLayout>
    )
}
