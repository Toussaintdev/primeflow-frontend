export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateHeure(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDateLongue(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMontant(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const nombre = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(nombre)) return "—";
  return `${new Intl.NumberFormat("fr-FR").format(nombre)} FCFA`;
}

export function formatNombre(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  const nombre = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(nombre)) return "—";
  return new Intl.NumberFormat("fr-FR").format(nombre);
}

export const STATUT_PERIODE_LABELS: Record<string, string> = {
  Ouverte: "Ouverte",
  Calculee: "Calculée",
  Cloturee: "Clôturée",
};

export const STATUT_PERIODE_STYLES: Record<string, string> = {
  Ouverte: "bg-blue-500/15 text-blue-600",
  Calculee: "bg-success/20 text-success",
  Cloturee: "bg-muted text-muted-foreground",
};
