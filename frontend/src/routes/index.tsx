import { createFileRoute } from '@tanstack/react-router'
import { LayoutContainer } from "@/components";

const Root = () => {
    return (
        <LayoutContainer className="p-4">
            <h3>Welcome to the Snap side of the Receipts!</h3>
        </LayoutContainer>
    )
}

export const Route = createFileRoute('/')({
    component: Root,
})