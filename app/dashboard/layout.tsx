import AppSideBar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar baad mein add karenge */}
        <SidebarProvider>
          <AppSideBar />
          <main className="flex-1 p-8">{children}</main>
        </SidebarProvider>
      </div>
    </div>
  );
}
