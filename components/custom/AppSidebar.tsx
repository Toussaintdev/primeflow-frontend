"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "../ui/sidebar";
import { NAV_LINKS } from "@/constants/nav";
import { canAccessRoute } from "@/constants/access";
import { logout } from "@/lib/api";

export default function AppSidebar({ roleLabel = "" }: { roleLabel?: string }) {
  const pathname = usePathname();

  const links = NAV_LINKS.filter((item) =>
    canAccessRoute(item.href.replace(/\/$/, ""), roleLabel),
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="bg-header h-20 border-b px-4 flex items-center">
        <div className="font-bold text-primary text-lg">LCT</div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroupContent>
          <SidebarMenu className="p-3 gap-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const route = item.href.replace(/\/$/, "");
              const active =
                pathname === route || pathname.startsWith(`${route}/`);

              return (
                <SidebarMenuButton
                  asChild
                  key={item.label}
                  tooltip={item.label}
                  className={`px-4 py-6 gap-4 font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenuButton
          className="px-4 py-6 font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-4"
          onClick={logout}
        >
          <LogOutIcon />
          <span>Déconnexion</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
