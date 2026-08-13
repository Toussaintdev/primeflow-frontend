import { ChartLineLabel } from "@/components/custom/LineChart";
import { ChartPieDonutText } from "@/components/custom/PieChart";
import { SectionCards } from "@/components/custom/section-cards";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Tableau de bord</p>
          <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p>
        </div>
        <Card className=""></Card>
      </div>
      <div className="space-y-(--space-md) mt-(--space-lg)">
        {/* <div className="grid grid-cols-4 gap-(--space-md)"> */}
        <SectionCards />
        {/* </div> */}

        <div className="grid grid-cols-3 gap-(--space-md)">
          <div>
            <ChartPieDonutText />
          </div>
          <div className="col-span-2">
            <ChartLineLabel />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-(--space-md)">
          <Card className="col-span-2 p-(--space-md)">
            <p className="font-bold">Dernieres activités</p>
            <div className="space-y-(--space-md)">
              <div className="flex justify-between">
                <p>Calcul de primes - Novembre 2024</p>
                <Badge className="bg-success/30 text-success">Succès</Badge>
                <p>Aujourd'hui, 10:45</p>
                <p>Admin</p>
              </div>
              <div className="flex justify-between">
                <p>Calcul de primes - Novembre 2024</p>
                <Badge className="bg-success/30 text-success">
                  Succès
                </Badge>{" "}
                <p>Aujourd'hui, 10:45</p>
                <p>Admin</p>
              </div>
              <div className="flex justify-between">
                <p>Calcul de primes - Novembre 2024</p>
                <Badge className="bg-success/30 text-success">
                  Succès
                </Badge>{" "}
                <p>Aujourd'hui, 10:45</p>
                <p>Admin</p>
              </div>
              <div className="flex justify-between">
                <p>Calcul de primes - Novembre 2024</p>
                <Badge className="bg-success/30 text-success">
                  Succès
                </Badge>{" "}
                <p>Aujourd'hui, 10:45</p>
                <p>Admin</p>
              </div>
            </div>
          </Card>
          <Card className="p-(--space-md)">
            <p className="font-bold">Top</p>
            <div className="space-y-(--space-md)">
              <div className="flex justify-between">
                <p>1</p>
                <p>Personne 1</p>
                <p className="font-bold">25 000 FCFA</p>
              </div>
              <div className="flex justify-between">
                <p>1</p>
                <p>Personne 1</p>
                <p className="font-bold">25 000 FCFA</p>
              </div>
              <div className="flex justify-between">
                <p>1</p>
                <p>Personne 1</p>
                <p className="font-bold">25 000 FCFA</p>
              </div>
              <div className="flex justify-between">
                <p>1</p>
                <p>Personne 1</p>
                <p className="font-bold">25 000 FCFA</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
