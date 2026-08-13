import {
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileBarChart,
  Home,
  Settings,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";

export const NAV_LINKS = [
  {
    label: "Tableau de bord",
    href: "/dashboard/",
    icon: Home,
  },
  {
    label: "Employés",
    href: "/employes/",
    icon: Users,
  },
  {
    label: "Période de calcul",
    href: "/periode-calcul/",
    icon: CalendarClock,
  },
  {
    label: "Performances",
    href: "",
    icon: TrendingUp,
  },
  {
    label: "Règle de calcul",
    href: "/regle-calcul/",
    icon: TrendingUp,
  },
  {
    label: "Calcul de primes",
    href: "",
    icon: Calculator,
  },
  {
    label: "Validation",
    href: "/validations/",
    icon: CheckCircle2,
  },
  {
    label: "Rapports",
    href: "/rapports/",
    icon: FileBarChart,
  },
  {
    label: "Paramètres",
    href: "",
    icon: Settings,
  },

  {
    label: "Utilisateurs",
    href: "/utilisateurs/",
    icon: UserCog,
  },

  {
    label: "Journal d'audit",
    href: "/journal-audit/",
    icon: ClipboardList,
  },
];
