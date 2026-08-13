"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import { LogOut, LogOutIcon } from "lucide-react";
import { logout } from "@/lib/api";

export default function AppSidebar() {
  const [clickItem, setClickItem] = useState("Tableau de bord");
  return (
    <Sidebar collapsible="icon" className="border-r-transparent">
      <SidebarHeader className="bg-header text-header-foreground h-20"></SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroupContent>
          <SidebarMenu className="p-4 gap-2">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuButton
                  asChild
                  key={item.label}
                  className={`px-4 py-6 gap-4 font-bold transition-all duration-(--transition-normal) hover:scale-110 ${clickItem == item.label ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : ""}`}
                  onClick={() => setClickItem(item.label)}
                >
                  <Link href={item.href} className="">
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton
          asChild
          className="px-4 py-6 font-bold text-destructive hover:text-destructive gap-4"
          onClick={logout}
        >
          <Link href="">
            <LogOutIcon />
            <span>Déconnexion</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
