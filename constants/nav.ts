import {
  Calculator,
  ClipboardList,
  FileBarChart,
  Home,
  Settings,
  TrendingUp,
} from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Tableau de bord",
    href: "/dashboard/",
    icon: Home,
  },
  {
    label: "Performances",
    href: "/performances/",
    icon: TrendingUp,
  },
  {
    label: "Calcul de primes",
    href: "/calcul-primes/",
    icon: Calculator,
  },
  {
    label: "Rapports",
    href: "/rapports/",
    icon: FileBarChart,
  },
  {
    label: "Journal d'audit",
    href: "/journal-audit/",
    icon: ClipboardList,
  },
  {
    label: "Paramètres",
    href: "/parametres/",
    icon: Settings,
  },
];
