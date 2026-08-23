"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Calculator, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/custom/DataTable";
import {
  calculerPeriode,
  genererRapportPrimes,
  getPeriodesCalcul,
  getPrimes,
} from "@/lib/api";
import {
  formatDate,
  formatMontant,
  STATUT_PERIODE_LABELS,
  STATUT_PERIODE_STYLES,
} from "@/lib/format";

const columns: DataTableColumn<CalculPrimeType>[] = [
  {
    id: "employe_nom",
    header: "Employé",
    cell: (row) => row.employe_nom,
    sortValue: (row) => row.employe_nom,
    searchValue: (row) => row.employe_nom,
  },
  {
    id: "categorie",
    header: "Catégorie",
    cell: (row) => row.categorieProfessionnelle ?? "—",
    sortValue: (row) => row.categorieProfessionnelle ?? "",
  },
  {
    id: "montantIndividuel",
    header: "Prime individuelle",
    cell: (row) => formatMontant(row.montantIndividuel),
    sortValue: (row) => parseFloat(row.montantIndividuel),
  },
  {
    id: "montantCollectif",
    header: "Prime collective",
    cell: (row) => formatMontant(row.montantCollectif),
    sortValue: (row) => parseFloat(row.montantCollectif),
  },
  {
    id: "montantTotal",
    header: "Total",
    cell: (row) => (
      <span className="font-semibold">{formatMontant(row.montantTotal)}</span>
    ),
    sortValue: (row) => parseFloat(row.montantTotal),
  },
];

export default function CalculPrimesPage() {
  const [periodes, setPeriodes] = useState<PeriodeCalculType[]>([]);
  const [periodeId, setPeriodeId] = useState("");
  const [primesListe, setPrimesListe] = useState<CalculPrimeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [calcul, setCalcul] = useState(false);
  const [generation, setGeneration] = useState(false);

  async function chargerPeriodes(selectionner?: string) {
    try {
      const data = await getPeriodesCalcul();
      const triees = [...data].sort((a, b) =>
        a.dateDebut < b.dateDebut ? 1 : -1,
      );
      setPeriodes(triees);
      const cible = selectionner ?? triees[0]?.idPeriode ?? "";
      setPeriodeId(cible);
      if (!cible) setLoading(false);
    } catch (e) {
      toast.error((e as Error).message);
      setLoading(false);
    }
  }

  useEffect(() => {
    chargerPeriodes();
  }, []);

  useEffect(() => {
    if (!periodeId) return;
    setLoading(true);
    getPrimes({ periodeCalcul: periodeId })
      .then(setPrimesListe)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [periodeId]);

  const periode = useMemo(
    () => periodes.find((p) => p.idPeriode === periodeId),
    [periodes, periodeId],
  );

  const total = primesListe.reduce(
    (acc, p) => acc + parseFloat(p.montantTotal || "0"),
    0,
  );

  async function lancerCalcul() {
    if (!periode) return;
    setCalcul(true);
    try {
      await calculerPeriode(periode.idPeriode);
      toast.success("Calcul terminé avec succès.");
      await chargerPeriodes(periode.idPeriode);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCalcul(false);
    }
  }

  async function genererRapport() {
    if (!periode) return;
    setGeneration(true);
    try {
      await genererRapportPrimes(periode.idPeriode);
      toast.success("Rapport Excel généré. Retrouvez-le dans Rapports.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setGeneration(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calcul des primes</h1>
          <p className="text-muted-foreground">
            Consultez et déclenchez le calcul des primes de productivité par
            période.
          </p>
        </div>
        {periode && (
          <div className="flex gap-2">
            {periode.statut === "Ouverte" && (
              <Button
                onClick={lancerCalcul}
                disabled={calcul || !periode.regleCalcul}
              >
                <Calculator className="mr-2 h-4 w-4" />
                {calcul ? "Calcul en cours…" : "Lancer le calcul"}
              </Button>
            )}
            {periode.statut === "Calculee" && (
              <Button
                onClick={genererRapport}
                disabled={generation}
                variant="outline"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {generation ? "Génération…" : "Générer le rapport Excel"}
              </Button>
            )}
          </div>
        )}
      </div>

      {periode && periode.statut === "Ouverte" && !periode.regleCalcul && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700">
          Aucune règle de calcul n'est associée à cette période. Rendez-vous
          dans{" "}
          <span className="font-semibold">Paramètres → Période de calcul</span>{" "}
          pour en lier une avant de lancer le calcul.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Select value={periodeId} onValueChange={setPeriodeId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Choisir une période" />
          </SelectTrigger>
          <SelectContent>
            {periodes.map((p) => (
              <SelectItem key={p.idPeriode} value={p.idPeriode}>
                {formatDate(p.dateDebut)} – {formatDate(p.dateFin)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {periode && (
          <Badge
            className={STATUT_PERIODE_STYLES[periode.statut]}
            variant="secondary"
          >
            {STATUT_PERIODE_LABELS[periode.statut]}
          </Badge>
        )}
        {primesListe.length > 0 && (
          <span className="text-sm text-muted-foreground">
            Total distribué :{" "}
            <span className="font-semibold text-foreground">
              {formatMontant(total)}
            </span>
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={primesListe}
        loading={loading}
        searchable
        getRowId={(row) => row.idPrime}
        searchPlaceholder="Rechercher un employé…"
        emptyMessage={
          periode?.statut === "Ouverte"
            ? "Cette période n'a pas encore été calculée."
            : "Aucune prime pour cette période."
        }
      />
    </div>
  );
}
