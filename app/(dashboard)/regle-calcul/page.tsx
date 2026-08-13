import { Card } from "@/components/ui/card";

export default function page() {
  const categorie = [
    "Catégorie 1",
    "Catégorie 2",
    "Catégorie 3",
    "Catégorie 4",
    "Catégorie 5",
  ];

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Règle de calcul</p>
          {/* <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p> */}
        </div>
        <Card className=""></Card>
      </div>
      <div className="space-y-(--space-md) mt-(--space-lg)"></div>
    </div>
  );
}
