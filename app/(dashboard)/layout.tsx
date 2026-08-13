"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import { Card } from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getRoles, getUtilisateurConnecte } from "@/lib/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [utilisateurConnecte, setUtilisateurConnecte] = useState<UserType>();
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isCall, setIsCall] = useState(false);
  useEffect(() => {
    const fetchUtilisateurConnecte = async () => {
      setIsCall(true);
      try {
        const data = await getUtilisateurConnecte();
        setUtilisateurConnecte(data);
        const roles = await getRoles();
        setRoles(roles);
        setIsCall(false);
      } catch {}
    };
    fetchUtilisateurConnecte();
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="w-full h-full ">
            <header className="h-20 bg-header text-header-foreground sticky top-0 z-30">
              <div className="flex">
                <div className="flex-1">
                  <Link href="/renitialise-password/">
                    Réinitialiser votre mot de passe
                  </Link>
                </div>

                <div>
                  <p>{utilisateurConnecte?.username}</p>
                  <p>
                    {
                      roles.find(
                        (role) => role.code == utilisateurConnecte?.role,
                      )?.libelle
                    }
                  </p>
                </div>
              </div>
            </header>
            <div className="m-10 mt-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
