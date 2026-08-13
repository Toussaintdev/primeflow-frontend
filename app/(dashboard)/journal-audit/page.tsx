import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

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
          <p className="text-(length:--text-2xl) font-bold">Journal audit</p>
          {/* <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p> */}
        </div>
        <Card className=""></Card>
      </div>
      <div className="space-y-(--space-md) mt-(--space-lg)">
        <div className="grid grid-cols-3">
          <div>
            <Field orientation="horizontal">
              <Input type="search" placeholder="Rechercher un employé..." />
              {/* <Button>Search</Button> */}
            </Field>
          </div>
          <div className="">
            <Field>
              <Combobox items={categorie}>
                <ComboboxInput placeholder="Catégorie professionnelle" />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {categorie.map((item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>
        </div>
        <Card className="p-0">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="w-25 text-accent font-bold">
                  Date et heure
                </TableHead>
                <TableHead className="text-accent font-bold">
                  Utilisateur
                </TableHead>
                <TableHead className="text-accent font-bold">Action</TableHead>
                <TableHead className="text-accent font-bold">Module</TableHead>
                <TableHead className="text-accent font-bold">Détails</TableHead>
                <TableHead className="text-right text-accent font-bold">
                  Adresse IP
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
              <TableRow className="hover:bg-table-row-hover">
                <TableCell className="font-medium">05/08/2026 10:10</TableCell>
                <TableCell>User x</TableCell>
                <TableCell>Validation d'une prime</TableCell>
                <TableCell>Validations</TableCell>
                <TableCell>Validé pour employé x</TableCell>
                <TableCell className="text-right">10.0.0.5</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
