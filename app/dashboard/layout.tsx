export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar baad mein add karenge */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}