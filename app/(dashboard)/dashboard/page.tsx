"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCards } from "@/components/custom/section-cards";
import {
  EvolutionPrimesChart,
  type PointEvolution,
} from "@/components/custom/LineChart";
import { RepartitionPrimesChart } from "@/components/custom/PieChart";
import { BandeauPrimesPretes } from "@/components/custom/BandeauPrimesPretes";
import {
  getEmployes,
  getMesActivites,
  getPeriodesCalcul,
  getPeriodesCalculPretes,
  getPrimes,
  getRoles,
  getUtilisateurConnecte,
} from "@/lib/api";
import { roleToKey } from "@/constants/access";
import { formatDate, formatDateHeure, formatMontant } from "@/lib/format";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalEmployes, setTotalEmployes] = useState(0);
  const [periodeEnCours, setPeriodeEnCours] =
    useState<PeriodeCalculType | null>(null);
  const [dernierePeriode, setDernierePeriode] =
    useState<PeriodeCalculType | null>(null);
  const [primesDernierePeriode, setPrimesDernierePeriode] = useState<
    CalculPrimeType[]
  >([]);
  const [evolution, setEvolution] = useState<PointEvolution[]>([]);
  const [activites, setActivites] = useState<JournalAuditType[]>([]);
  const [periodesPretes, setPeriodesPretes] = useState<PeriodeCalculType[]>([]);
  const [estFinance, setEstFinance] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function charger() {
      try {
        const [employes, periodes, moi, roles, mesActivites] =
          await Promise.all([
            getEmployes(),
            getPeriodesCalcul(),
            getUtilisateurConnecte(),
            getRoles(),
            getMesActivites(5).catch(() => []),
          ]);
        if (!mounted) return;

        const roleLabel = roles.find((r) => r.code === moi.role)?.libelle ?? "";
        const finance = roleToKey(roleLabel) === "finance";
        setEstFinance(finance);
        setTotalEmployes(employes.length);
        setActivites(mesActivites);

        const ouverte = periodes
          .filter((p) => p.statut === "Ouverte")
          .sort((a, b) => (a.dateDebut < b.dateDebut ? 1 : -1))[0];
        setPeriodeEnCours(ouverte ?? null);

        const calculees = periodes
          .filter((p) => p.statut === "Calculee")
          .sort((a, b) => (a.dateFin < b.dateFin ? 1 : -1));
        const derniere = calculees[0] ?? null;
        setDernierePeriode(derniere);

        if (finance) {
          getPeriodesCalculPretes()
            .then((p) => mounted && setPeriodesPretes(p))
            .catch(() => {});
        }

        if (derniere) {
          const primesActuelles = await getPrimes({
            periodeCalcul: derniere.idPeriode,
          });
          if (mounted) setPrimesDernierePeriode(primesActuelles);
        }

        // Évolution sur les 6 dernières périodes calculées (les plus anciennes en premier)
        const dernieresSix = calculees.slice(0, 6).reverse();
        const points = await Promise.all(
          dernieresSix.map(async (periode) => {
            const primesPeriode = await getPrimes({
              periodeCalcul: periode.idPeriode,
            }).catch(() => []);
            const total = primesPeriode.reduce(
              (acc, p) => acc + parseFloat(p.montantTotal || "0"),
              0,
            );
            return {
              label: `${formatDate(periode.dateDebut)}`,
              total,
            };
          }),
        );
        if (mounted) setEvolution(points);
      } catch {
        // les erreurs individuelles sont déjà gérées par apiCall / catch ci-dessus
      } finally {
        if (mounted) setLoading(false);
      }
    }

    charger();
    return () => {
      mounted = false;
    };
  }, []);

  const montantDernierePeriode = primesDernierePeriode.reduce(
    (acc, p) => acc + parseFloat(p.montantTotal || "0"),
    0,
  );
  const montantIndividuel = primesDernierePeriode.reduce(
    (acc, p) => acc + parseFloat(p.montantIndividuel || "0"),
    0,
  );
  const montantCollectif = primesDernierePeriode.reduce(
    (acc, p) => acc + parseFloat(p.montantCollectif || "0"),
    0,
  );
  const topPrimes = [...primesDernierePeriode]
    .sort((a, b) => parseFloat(b.montantTotal) - parseFloat(a.montantTotal))
    .slice(0, 5);

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Tableau de bord</p>
          <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p>
        </div>
      </div>

      <div className="space-y-(--space-md) mt-(--space-lg)">
        <SectionCards
          loading={loading}
          totalEmployes={totalEmployes}
          periodeEnCours={periodeEnCours}
          montantDernierePeriode={montantDernierePeriode}
          labelDernierePeriode={
            dernierePeriode
              ? `${formatDate(dernierePeriode.dateDebut)} – ${formatDate(dernierePeriode.dateFin)}`
              : null
          }
        />

        {estFinance && <BandeauPrimesPretes periodes={periodesPretes} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--space-md)">
          <div className="lg:col-span-2">
            <EvolutionPrimesChart data={evolution} loading={loading} />
          </div>
          <RepartitionPrimesChart
            montantIndividuel={montantIndividuel}
            montantCollectif={montantCollectif}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-(--space-md)">
          <Card className="lg:col-span-2 p-(--space-md)">
            <p className="font-bold">Dernières activités</p>
            <div className="space-y-(--space-md) mt-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))
              ) : activites.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune activité récente.
                </p>
              ) : (
                activites.map((a) => (
                  <div
                    key={a.idJournal}
                    className="flex flex-wrap justify-between gap-2 text-sm border-b pb-2 last:border-none"
                  >
                    <p className="flex-1 min-w-40">
                      {/* {a.action} — {a.objet} */}
                      {a.action}
                    </p>
                    <Badge
                      className={
                        a.resultat?.toLowerCase() === "succes" ||
                        a.resultat?.toLowerCase() === "succès"
                          ? "bg-success/30 text-success"
                          : "bg-destructive/20 text-destructive"
                      }
                    >
                      {a.resultat}
                    </Badge>
                    <p className="text-muted-foreground">
                      {formatDateHeure(a.dateJournal)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-(--space-md)">
            <p className="font-bold">Top primes — dernière période</p>
            <div className="space-y-(--space-md) mt-2">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))
              ) : topPrimes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune prime calculée pour l'instant.
                </p>
              ) : (
                topPrimes.map((prime, index) => (
                  <div
                    key={prime.idPrime}
                    className="flex justify-between text-sm"
                  >
                    <p className="text-muted-foreground">{index + 1}</p>
                    <p className="flex-1 px-2 truncate">{prime.employe_nom}</p>
                    <p className="font-bold">
                      {formatMontant(prime.montantTotal)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
