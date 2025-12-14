import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      <div className="flex-1 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
