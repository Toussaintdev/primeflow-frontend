"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, ExternalLink, FileSpreadsheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRapports, urlFichierRapport } from "@/lib/api";
import { formatDateHeure } from "@/lib/format";

export default function RapportsPage() {
  const [rapports, setRapports] = useState<RapportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<RapportType | null>(null);

  useEffect(() => {
    getRapports()
      .then(setRapports)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const url = selection ? urlFichierRapport(selection) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rapports & statistiques</h1>
        <p className="text-muted-foreground">
          Les rapports Excel générés après chaque calcul de primes. Cliquez sur
          une vignette pour l'ouvrir ou la télécharger.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : rapports.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun rapport généré pour l'instant. Les rapports apparaissent ici
          après avoir cliqué sur « Générer le rapport Excel » depuis Calcul de
          primes.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rapports.map((rapport) => (
            <button
              key={rapport.idRapport}
              onClick={() => setSelection(rapport)}
              className="text-left"
            >
              <Card className="h-40 flex flex-col items-center justify-center gap-2 p-4 transition-shadow hover:shadow-md cursor-pointer">
                <FileSpreadsheet className="h-10 w-10 text-success" />
                <p className="text-sm font-medium text-center truncate w-full">
                  {rapport.nomFichier ?? `Rapport ${rapport.type}`}
                </p>
                <p className="text-xs text-muted-foreground text-center truncate w-full">
                  {rapport.periodeLabel ??
                    formatDateHeure(rapport.dateCreation)}
                </p>
              </Card>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={!!selection}
        onOpenChange={(open) => !open && setSelection(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selection?.nomFichier ?? "Rapport"}</DialogTitle>
            <DialogDescription>
              {selection?.periodeLabel && (
                <>Période : {selection.periodeLabel}. </>
              )}
              Généré le{" "}
              {selection ? formatDateHeure(selection.dateCreation) : ""}
              {selection?.genereePar_nom
                ? ` par ${selection.genereePar_nom}`
                : ""}
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" asChild disabled={!url}>
              <a href={url ?? "#"} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir
              </a>
            </Button>
            <Button asChild disabled={!url}>
              <a href={url ?? "#"} download>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
