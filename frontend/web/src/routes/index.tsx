import { createFileRoute } from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";

const Root = () => {
    return (
        <LayoutContainer>
            <h3>Welcome to the Snap side of the Receipts!</h3>
        </LayoutContainer>
    )
}

export const Route = createFileRoute('/')({
    component: Root,
})