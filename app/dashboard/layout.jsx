import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <DashboardSidebar />
      <main className="flex-1 ml-60 p-8 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
