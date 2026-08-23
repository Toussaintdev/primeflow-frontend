"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/custom/DataTable";
import { getPeriodesCalcul, getPerformances } from "@/lib/api";
import { formatDate, formatNombre } from "@/lib/format";

const typeStyles: Record<string, string> = {
  Individuelle: "bg-blue-500/15 text-blue-600",
  Navire: "bg-amber-500/15 text-amber-600",
  Collective: "bg-success/15 text-success",
};

const columns: DataTableColumn<PerformanceType>[] = [
  {
    id: "typePerformance",
    header: "Type",
    cell: (row) => (
      <Badge className={typeStyles[row.typePerformance]} variant="secondary">
        {row.typePerformance}
      </Badge>
    ),
    sortValue: (row) => row.typePerformance,
  },
  {
    id: "sujet",
    header: "Employé / Navire",
    cell: (row) =>
      row.employe_nom || row.navire_nom || "Ensemble de la période",
    searchValue: (row) => row.employe_nom || row.navire_nom || "",
  },
  {
    id: "nombreMouvement",
    header: "Nombre de mouvements",
    cell: (row) => formatNombre(row.nombreMouvement),
    sortValue: (row) => row.nombreMouvement,
  },
  {
    id: "gmph",
    header: "GMPH (brut)",
    cell: (row) => formatNombre(row.gmph),
    sortValue: (row) => parseFloat(row.gmph),
  },
  {
    id: "ggmph",
    header: "GGMPH (réel)",
    cell: (row) => formatNombre(row.ggmph),
    sortValue: (row) => parseFloat(row.ggmph),
  },
  {
    id: "dateCalcul",
    header: "Calculé le",
    cell: (row) => formatDate(row.dateCalcul),
    sortValue: (row) => row.dateCalcul,
  },
];

export default function PerformancesPage() {
  const [periodes, setPeriodes] = useState<PeriodeCalculType[]>([]);
  const [periodeId, setPeriodeId] = useState<string>("");
  const [typeFiltre, setTypeFiltre] = useState<string>("toutes");
  const [performances, setPerformances] = useState<PerformanceType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPeriodesCalcul()
      .then((data) => {
        const calculees = data
          .filter((p) => p.statut !== "Ouverte")
          .sort((a, b) => (a.dateFin < b.dateFin ? 1 : -1));
        setPeriodes(calculees);
        if (calculees.length > 0) setPeriodeId(calculees[0].idPeriode);
        else setLoading(false);
      })
      .catch((e) => {
        toast.error(e.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!periodeId) return;
    setLoading(true);
    getPerformances({
      periodeCalcul: periodeId,
      ...(typeFiltre !== "toutes" ? { typePerformance: typeFiltre } : {}),
    })
      .then(setPerformances)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [periodeId, typeFiltre]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performances</h1>
        <p className="text-muted-foreground">
          Performances individuelles, par navire et collectives, calculées pour
          une période donnée.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={periodeId} onValueChange={setPeriodeId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choisir une période" />
          </SelectTrigger>
          <SelectContent>
            {periodes.map((p) => (
              <SelectItem key={p.idPeriode} value={p.idPeriode}>
                {formatDate(p.dateDebut)} – {formatDate(p.dateFin)}{" "}
                {p.statut === "Ouverte" ? "(en cours)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFiltre} onValueChange={setTypeFiltre}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Type de performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Tous les types</SelectItem>
            <SelectItem value="Individuelle">Individuelle</SelectItem>
            <SelectItem value="Navire">Par navire</SelectItem>
            <SelectItem value="Collective">Collective</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {periodes.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground">
          Aucune période calculée pour l&apos;instant. Les performances
          apparaîtront ici après le premier calcul de primes.
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={performances}
          loading={loading}
          searchable
          getRowId={(row) => row.code}
          searchPlaceholder="Rechercher un employé ou un navire…"
          emptyMessage="Aucune performance enregistrée pour cette période."
        />
      )}
    </div>
  );
}
