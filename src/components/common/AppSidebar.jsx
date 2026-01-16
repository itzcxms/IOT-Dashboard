import {
  Home,
  Settings,
  User2,
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  Droplets,
  AlertTriangle,
  ClipboardList,
  Users,
  UserPlus,
  Shield,
  BarChart3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useAuth } from "@/context/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Menu structure with collapsible groups
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Tout voir", url: "/dashboard", icon: Home },
      { title: "Gestion de l'aire", url: "/gestion-de-l-aire", icon: ClipboardList },
      { title: "Savon", url: "/savon", icon: Droplets },
      { title: "Zone Inondable", url: "/zone-inondable", icon: AlertTriangle },
    ],
  },
  {
    title: "Satisfaction",
    icon: BarChart3,
    children: [
      { title: "Analyse", url: "/analyse-satisfaction", icon: BarChart3 },
    ],
  },
  {
    title: "Utilisateurs",
    icon: Users,
    children: [
      { title: "Liste des utilisateurs", url: "/admin/liste-utilisateurs", icon: Users },
      { title: "Création de compte", url: "/admin/creer-compte", icon: UserPlus },
      { title: "Gestion des permissions", url: "/admin/permissions", icon: Shield },
    ],
  },
];

const user_dropdown = [
  { title: "Compte", url: "/compte/", icon: User2 },
  { title: "Paramètres du compte", url: "/compte/details", icon: Settings },
  { title: "Déconnexion", url: "DECO" },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Track which menus are open
  const [openMenus, setOpenMenus] = useState(() => {
    // Open the menu that contains the current path by default
    const initial = {};
    menuItems.forEach((item) => {
      const isActive = item.children?.some((child) => location.pathname === child.url);
      if (isActive) {
        initial[item.title] = true;
      }
    });
    return initial;
  });

  function toggleMenu(title) {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  function isMenuActive(item) {
    return item.children?.some((child) => location.pathname === child.url);
  }

  function isItemActive(url) {
    return location.pathname === url;
  }

  function deconnexion() {
    logout();
    navigate("/");
  }

  return (
    <Sidebar>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const menuActive = isMenuActive(item);
                const isOpen = openMenus[item.title] || false;

                return (
                  <Collapsible
                    key={item.title}
                    open={isOpen}
                    onOpenChange={() => toggleMenu(item.title)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "relative flex items-center gap-3 px-4 py-6 text-base font-medium transition-colors cursor-pointer",
                            menuActive && "text-sidebar-primary"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-2">
                          {item.children?.map((child) => {
                            const childActive = isItemActive(child.url);
                            return (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={childActive}
                                  className={cn(
                                    "relative py-5 text-sm transition-colors px-3",
                                    childActive && "font-medium"
                                  )}
                                >
                                  <a href={child.url}>
                                    {/* Barre a gauche */}
                                    {childActive && (
                                      <span className="fixed left-0 h-full w-1 rounded-r-full bg-sidebar-primary" />
                                    )}
                                    <span>{child.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border py-4">
        <SidebarMenu className="gap-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "flex items-center gap-3 px-4 py-6 text-sm font-medium",
                isItemActive("/compte/details") && "text-sidebar-primary"
              )}
            >
              <a href="/compte/details">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <SidebarMenuButton asChild className="px-4 py-2.5">
                <DropdownMenuTrigger className="flex items-center gap-3 w-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                    <User2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">
                      {user?.prenom} {user?.nom}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email || "Utilisateur"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </DropdownMenuTrigger>
              </SidebarMenuButton>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {user_dropdown.map((item) => {
                  if (item.url === "DECO") {
                    return (
                      <DropdownMenuItem key={item.title}>
                        <button
                          onClick={() => deconnexion()}
                          className="w-full text-left"
                        >
                          {item.title}
                        </button>
                      </DropdownMenuItem>
                    );
                  } else {
                    return (
                      <DropdownMenuItem key={item.title}>
                        <a href={item.url} className="w-full">
                          {item.title}
                        </a>
                      </DropdownMenuItem>
                    );
                  }
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
