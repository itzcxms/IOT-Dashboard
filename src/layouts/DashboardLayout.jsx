import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar.jsx";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* La Sidebar se met directement dans le Provider */}
      <AppSidebar />

      {/* Le contenu principal va dans SidebarInset */}
      <SidebarInset>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
