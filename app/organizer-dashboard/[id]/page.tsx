// Auth is enforced client-side via useAuth (JWT in localStorage). No server session.
import { NameBanner } from "@/app/dashboard/NameBanner"
import OrganizerDashboardPage from "../OrganizerDashboardPage"
import Navbar from "../navbar"
import { DashboardProvider } from "@/contexts/dashboard-context"

interface DashboardPageProps {
  params: Promise<{ id: string }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params
  return (
    <DashboardProvider>
      <Navbar />
      <NameBanner name="Organizer" designation="Organizer" />
      <OrganizerDashboardPage organizerId={id} />
    </DashboardProvider>
  )
}