"use client";

import * as React from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { formatNombre } from "@/lib/format";

export type LigneTranche = {
  nombreMouvementMin: string;
  nombreMouvementMax: string;
  ggmphMin: string;
  ggmphMax: string;
  montantPrime: string;
  description: string;
};

export function ligneVide(min = 0, ggmphMin = 0): LigneTranche {
  return {
    nombreMouvementMin: String(min),
    nombreMouvementMax: "",
    ggmphMin: String(ggmphMin),
    ggmphMax: "",
    montantPrime: "",
    description: "",
  };
}

/**
 * Logique « gobelet » : tant que la dernière tranche remplie n'atteint pas
 * l'objectif cible (nombre de mouvements ET ggmph), on propose une nouvelle
 * ligne qui repart exactement où la précédente s'est arrêtée. Une fois
 * l'objectif atteint, on arrête d'en proposer — le gobelet est plein.
 */
export function TrancheMatrixBuilder({
  titre,
  cible,
  lignes,
  onChange,
}: {
  titre: string;
  cible: { nombreMouvement: number; ggmph: number } | null;
  lignes: LigneTranche[];
  onChange: (lignes: LigneTranche[]) => void;
}) {
  const derniere = lignes[lignes.length - 1];
  const derniereComplete =
    !!derniere &&
    derniere.nombreMouvementMax !== "" &&
    derniere.ggmphMax !== "";

  const objectifAtteint =
    !!cible &&
    derniereComplete &&
    Number(derniere.nombreMouvementMax) >= cible.nombreMouvement &&
    Number(derniere.ggmphMax) >= cible.ggmph;

  function majLigne(index: number, champ: keyof LigneTranche, valeur: string) {
    const copie = lignes.map((l, i) =>
      i === index ? { ...l, [champ]: valeur } : l,
    );
    onChange(copie);
  }

  function ajouterLigne() {
    if (!derniereComplete) return;
    onChange([
      ...lignes,
      ligneVide(Number(derniere.nombreMouvementMax), Number(derniere.ggmphMax)),
    ]);
  }

  function supprimerLigne(index: number) {
    onChange(lignes.filter((_, i) => i !== index));
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{titre}</p>
        {cible ? (
          objectifAtteint ? (
            <span className="flex items-center gap-1 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Objectif atteint
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Cible : {formatNombre(cible.nombreMouvement)} mouvements /{" "}
              {formatNombre(cible.ggmph)} ggmph
            </span>
          )
        ) : (
          <span className="text-sm text-amber-600">
            Aucun objectif défini pour cette catégorie — créez-en un dans
            l'onglet Objectifs.
          </span>
        )}
      </div>

      <div className="space-y-3">
        {lignes.map((ligne, index) => (
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end border-b pb-3"
          >
            <div>
              <Label className="text-xs">Mvt min</Label>
              <Input
                value={ligne.nombreMouvementMin}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label className="text-xs">Mvt max</Label>
              <Input
                type="number"
                value={ligne.nombreMouvementMax}
                onChange={(e) =>
                  majLigne(index, "nombreMouvementMax", e.target.value)
                }
              />
            </div>
            <div>
              <Label className="text-xs">GGMPH min</Label>
              <Input value={ligne.ggmphMin} disabled className="bg-muted" />
            </div>
            <div>
              <Label className="text-xs">GGMPH max</Label>
              <Input
                type="number"
                step="0.01"
                value={ligne.ggmphMax}
                onChange={(e) => majLigne(index, "ggmphMax", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Montant (FCFA)</Label>
              <Input
                type="number"
                value={ligne.montantPrime}
                onChange={(e) =>
                  majLigne(index, "montantPrime", e.target.value)
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => supprimerLigne(index)}
                disabled={lignes.length === 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="col-span-2 md:col-span-6">
              <Label className="text-xs">
                Description / interprétation (optionnel)
              </Label>
              <Textarea
                rows={1}
                placeholder="Ex. « Entre 0 et 500 mouvements, avec une productivité réelle de 0 à 10 ggmph, la prime est de 5000 FCFA »"
                value={ligne.description}
                onChange={(e) => majLigne(index, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={ajouterLigne}
        disabled={!derniereComplete || objectifAtteint}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter une tranche
      </Button>
      {!derniereComplete && (
        <p className="text-xs text-muted-foreground">
          Complétez les valeurs maximales de la tranche en cours pour pouvoir en
          ajouter une nouvelle.
        </p>
      )}
    </Card>
  );
}
