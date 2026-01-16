import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar.jsx";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* La Sidebar se met directement dans le Provider */}
      <AppSidebar />

      {/* Le contenu principal va dans SidebarInset */}
      <SidebarInset>
        {/* Header optionnel pour afficher le bouton trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-semibold text-lg">Aire de Chaumont-sur-Loire</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
