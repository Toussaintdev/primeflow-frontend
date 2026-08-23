import { CalendarClock, Coins, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatDate,
  formatMontant,
  STATUT_PERIODE_LABELS,
  STATUT_PERIODE_STYLES,
} from "@/lib/format";

type Props = {
  loading: boolean;
  totalEmployes: number;
  periodeEnCours: PeriodeCalculType | null;
  montantDernierePeriode: number;
  labelDernierePeriode: string | null;
};

export function SectionCards({
  loading,
  totalEmployes,
  periodeEnCours,
  montantDernierePeriode,
  labelDernierePeriode,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total employés</CardDescription>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-1" />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalEmployes}
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <Users2 />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm bg-sidebar border-t-0">
          <div className="text-muted-foreground">Employés enregistrés</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Période en cours</CardDescription>
          {loading ? (
            <Skeleton className="h-8 w-40 mt-1" />
          ) : periodeEnCours ? (
            <CardTitle className="text-lg font-medium tabular-nums @[100px]/card:text-xl">
              {formatDate(periodeEnCours.dateDebut)} –{" "}
              {formatDate(periodeEnCours.dateFin)}
            </CardTitle>
          ) : (
            <CardTitle className="text-base font-medium text-muted-foreground">
              Aucune période ouverte
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <CalendarClock />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm bg-sidebar border-t-0">
          {periodeEnCours && (
            <Badge
              className={STATUT_PERIODE_STYLES[periodeEnCours.statut]}
              variant="secondary"
            >
              {STATUT_PERIODE_LABELS[periodeEnCours.statut]}
            </Badge>
          )}
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Primes de la dernière période</CardDescription>
          {loading ? (
            <Skeleton className="h-8 w-32 mt-1" />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {formatMontant(montantDernierePeriode)}
            </CardTitle>
          )}
          <CardAction>
            <Badge variant="outline">
              <Coins />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm bg-sidebar border-t-0">
          <div className="text-muted-foreground">
            {labelDernierePeriode ?? "Aucun calcul effectué"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
