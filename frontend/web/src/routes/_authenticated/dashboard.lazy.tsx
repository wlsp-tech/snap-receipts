import {createLazyFileRoute} from '@tanstack/react-router'
import LayoutContainer from "@/components/shared/layout-container.tsx";

const Dashboard = () => {
  return (
      <LayoutContainer>
        <h3>Dashboard</h3>
      </LayoutContainer>
  )
}

export const Route = createLazyFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})