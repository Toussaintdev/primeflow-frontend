"use client";

import { PartyPopper, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

export function BandeauPrimesPretes({
  periodes,
}: {
  periodes: PeriodeCalculType[];
}) {
  const router = useRouter();
  const [masquees, setMasquees] = useState<string[]>([]);

  const visibles = periodes.filter((p) => !masquees.includes(p.idPeriode));
  if (visibles.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibles.map((periode) => (
        <Card
          key={periode.idPeriode}
          className="flex flex-row items-center justify-between gap-4 border-success/40 bg-success/10 p-4"
        >
          <div className="flex items-center gap-3">
            {/* <PartyPopper className="h-5 w-5 text-success shrink-0" /> */}
            <p className="text-sm">
              Les primes de la période{" "}
              <span className="font-semibold">
                {formatDate(periode.dateDebut)} – {formatDate(periode.dateFin)}
              </span>{" "}
              sont prêtes.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" onClick={() => router.push("/rapports/")}>
              Générer le rapport Excel
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setMasquees((prev) => [...prev, periode.idPeriode])
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
