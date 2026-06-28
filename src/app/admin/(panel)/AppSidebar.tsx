"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users, KanbanSquare, ListFilter, UserRound, LayoutDashboard, Newspaper, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

type Item = { href: string; label: string; icon: typeof Users };
type Group = { label: string; items: Item[] };

const roleLabels: Record<string, string> = { admin: "Admin", agent: "Agente", viewer: "Lector" };

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar({
  user, showUsers, showDashboard, showBlog, logoutAction,
}: {
  user: { name: string; role: string };
  showUsers: boolean;
  showDashboard: boolean;
  showBlog: boolean;
  logoutAction: () => void;
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const comercial: Item[] = [];
  if (showDashboard) comercial.push({ href: "/admin/dashboard", label: "Resumen", icon: LayoutDashboard });
  comercial.push({ href: "/admin", label: "Leads", icon: ListFilter });
  comercial.push({ href: "/admin/board", label: "Pipeline", icon: KanbanSquare });

  const contenido: Item[] = [];
  if (showBlog) contenido.push({ href: "/admin/blog", label: "Blog", icon: Newspaper });

  const cuenta: Item[] = [];
  if (showUsers) cuenta.push({ href: "/admin/users", label: "Usuarios", icon: Users });
  cuenta.push({ href: "/admin/profile", label: "Perfil", icon: UserRound });

  const groups: Group[] = [
    { label: "Comercial", items: comercial },
    { label: "Contenido", items: contenido },
    { label: "Cuenta", items: cuenta },
  ].filter((g) => g.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Wordmark neutro: cámbialo por el logo del cliente. */}
        <Link href="/admin" className="flex items-center px-2 py-2 font-semibold tracking-tight text-[var(--crm-ink)]">
          {collapsed ? "P" : "Panel"}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={isActive(pathname, href)} tooltip={label}>
                      <Link href={href}>
                        <Icon strokeWidth={1.9} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <div className="flex items-center gap-2 px-1 pb-1">
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--crm-ink-soft)]">
              {user.name}
            </span>
            <Badge variant="secondary" className="bg-[var(--crm-wine-tint)] text-[var(--crm-wine)]">
              {roleLabels[user.role] ?? user.role}
            </Badge>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logoutAction} className="w-full">
              <SidebarMenuButton asChild tooltip="Salir">
                <button type="submit" aria-label="Salir">
                  <LogOut strokeWidth={1.9} />
                  <span>Salir</span>
                </button>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
