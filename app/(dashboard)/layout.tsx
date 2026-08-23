"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getRoles, getUtilisateurConnecte } from "@/lib/api";
import { canAccessRoute } from "@/constants/access";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [utilisateur, setUtilisateur] = useState<UserType | null>(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const [user, roles] = await Promise.all([
          getUtilisateurConnecte(),
          getRoles(),
        ]);
        if (!mounted) return;

        const role = roles.find((item) => item.code === user.role);
        setUtilisateur(user);
        setRoleLabel(role?.libelle ?? "");

        if (!canAccessRoute(pathname, role?.libelle ?? "")) {
          router.replace("/not-authorized/");
        }
      } catch {
        // apiCall gère déjà l'expiration de session et la redirection vers /login/.
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSession();
    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (loading || !utilisateur) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Chargement de votre espace...
        </div>
      </div>
    );
  }

  if (!canAccessRoute(pathname, roleLabel)) return null;

  return (
    <SidebarProvider>
      <AppSidebar roleLabel={roleLabel} />
      <SidebarInset>
        <header className="h-20 bg-header text-header-foreground sticky top-0 z-30 border-b border-white/10">
          <div className="h-full flex items-center gap-4 px-4 md:px-6">
            <SidebarTrigger className="text-header-foreground hover:bg-white/10" />
            <div className="flex-1" />
            <Link
              href="/renitialise-password/"
              className="text-sm hover:underline"
            >
              Modifier le mot de passe
            </Link>
            <div className="hidden sm:block text-right leading-tight">
              <p className="font-semibold">{utilisateur.username}</p>
              <p className="text-xs opacity-75">{roleLabel}</p>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
