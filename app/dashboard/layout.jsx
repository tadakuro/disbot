import DashboardSidebar from '@/components/ui/DashboardSidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0e0e12]">
      <DashboardSidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
