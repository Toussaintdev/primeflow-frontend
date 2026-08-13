"use client";

import React, { useState } from "react";
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
import { Eye, EyeIcon } from "lucide-react";

export default function page() {
  // recupérer les employés et les catégories professionnelles
  const [categories, setCategories] = useState<CategorieType[]>([]);
  const [employes, setEmployes] = useState<EmployeType[]>([]);
  // const categorie = [
  //   "Catégorie 1",
  //   "Catégorie 2",
  //   "Catégorie 3",
  //   "Catégorie 4",
  //   "Catégorie 5",
  // ];

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Employés</p>
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
              <Combobox items={categories}>
                <ComboboxInput placeholder="Catégorie professionnelle" />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {categories.map((item) => (
                      <ComboboxItem key={item.code} value={item.code}>
                        {item.libelle}
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
            <TableCaption>La liste des employés.</TableCaption>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="text-accent font-bold">
                  Matricule
                </TableHead>
                <TableHead className="text-accent font-bold">
                  Nom complet
                </TableHead>
                <TableHead className="text-accent font-bold">
                  Fonction
                </TableHead>
                <TableHead className=" text-accent font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employes.map((item) => (
                <TableRow
                  className="hover:bg-table-row-hover font-bold"
                  key={item.idEmploye}
                >
                  <TableCell className="font-medium">
                    {item.idEmploye}
                  </TableCell>
                  <TableCell>
                    {item.nom} {item.prenom}
                  </TableCell>
                  <TableCell>
                    {
                      categories.find(
                        (categorie) =>
                          categorie.code == item.categorieProfessionnelle,
                      )?.libelle
                    }
                  </TableCell>
                  <TableCell className="flex text-right justify-end">
                    <Eye />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
