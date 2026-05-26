import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/dashboard/AppSideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <div className="h-14 border-b border-border flex items-center px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="h-8 w-8" />
        </div>
        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}