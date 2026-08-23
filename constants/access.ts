export type AccessRole =
  | "admin"
  | "rh"
  | "operations"
  | "superviseur"
  | "finance"
  | "direction";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function roleToKey(roleLabel = ""): AccessRole | null {
  const role = normalize(roleLabel);
  if (role.includes("admin")) return "admin";
  if (role.includes("ressources humaines") || role === "rh") return "rh";
  if (role.includes("superviseur")) return "superviseur";
  if (role.includes("finance")) return "finance";
  if (role.includes("direction generale") || role === "dg") return "direction";
  if (role.includes("direction des operations") || role === "operations")
    return "operations";
  if (role.includes("utilisateur")) return "admin";
  return null;
}

/**
 * Les restrictions de rôle côté frontend servent surtout à masquer les écrans.
 * Le backend doit rester l'autorité finale pour les permissions.
 *
 * Employés, Utilisateurs/Rôles, Période de calcul et Règle de calcul ne sont
 * plus des routes séparées : elles vivent en onglets dans /parametres/.
 * Seul l'Administrateur et les Ressources Humaines y ont accès ; parmi eux,
 * seul l'Administrateur voit l'onglet "Gestion des utilisateurs et rôles"
 * (contrôlé directement dans la page /parametres/, pas ici).
 */
export const ROUTE_ROLES: Record<string, AccessRole[]> = {
  "/parametres": ["admin", "rh"],
  "/journal-audit": ["admin"],
  "/performances": ["admin", "rh", "operations", "superviseur", "direction"],
  "/calcul-primes": ["admin", "rh", "operations", "finance", "direction"],
  "/rapports": [
    "admin",
    "rh",
    "operations",
    "superviseur",
    "finance",
    "direction",
  ],
  "/dashboard": [
    "admin",
    "rh",
    "operations",
    "superviseur",
    "finance",
    "direction",
  ],
};

export function canAccessRoute(pathname: string, roleLabel: string) {
  const match = Object.entries(ROUTE_ROLES).find(
    ([route]) => pathname === route || pathname.startsWith(`${route}/`),
  );
  if (!match) return true;

  const role = roleToKey(roleLabel);
  return role !== null && match[1].includes(role);
}
