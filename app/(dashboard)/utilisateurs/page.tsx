"use client";

import React, { useEffect, useState } from "react";
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
import { Field, FieldGroup } from "@/components/ui/field";
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
import { Delete, Edit, Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignupForm } from "@/components/signup-form";
import { getRoles, getUtilisateurs } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function page() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isCall, setIsCall] = useState(false);
  const [utilisateurs, setUtilisateurs] = useState<UserType[]>([]);
  const [creating, isCreating] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsCall(true);
      try {
        const data = await getRoles();
        setRoles(data);
        setIsCall(false);
      } catch {}
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const data = await getUtilisateurs();
        setUtilisateurs(data);
        isCreating(false);
      } catch {}
    };
    fetchUtilisateurs();
  }, [creating]);

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          <p className="text-(length:--text-2xl) font-bold">Utilisateurs</p>
          {/* <p className="text-muted-foreground text-(length:--text-base)">
            Vue d'ensemble du système
          </p> */}
        </div>
        <div className="">
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isCall}>
                  Créer un compte utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Inscription</DialogTitle>
                  {/* <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription> */}
                </DialogHeader>
                <FieldGroup>
                  <SignupForm
                    isCall={isCall}
                    roles={roles}
                    setCreating={isCreating}
                  />
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Ignorer</Button>
                  </DialogClose>
                  {/* <Button type="submit">Save changes</Button> */}
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
      <div className="space-y-(--space-md) mt-(--space-lg)">
        <div className="grid grid-cols-3">
          <div>
            <Field orientation="horizontal">
              <Input type="search" placeholder="Rechercher un utilsateur..." />
              {/* <Button>Search</Button> */}
            </Field>
          </div>
          <div className="">
            <Field>
              <Combobox items={roles}>
                <ComboboxInput placeholder="Choisi un rôle" />
                <ComboboxContent>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {roles.map((item) => (
                      <ComboboxItem key={item.code} value={item.libelle}>
                        {item.libelle}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>
        </div>
        <Card className="p-0 rounded-xs">
          <Table>
            <TableCaption>La liste des utilisateurs.</TableCaption>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="w-25 text-accent font-bold">ID</TableHead>
                <TableHead className="text-accent font-bold">
                  Username
                </TableHead>
                <TableHead className="text-accent font-bold">Email</TableHead>
                <TableHead className="text-accent font-bold">Role</TableHead>
                <TableHead className="text-accent font-bold">
                  Etat du compte
                </TableHead>
                <TableHead className="text-right text-accent font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {utilisateurs.map((item) => (
                <TableRow
                  key={item.idUtilisateur}
                  className="hover:bg-table-row-hover"
                >
                  <TableCell className="font-bold">
                    {item.idUtilisateur}
                  </TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    {roles.find((role) => role.code == item.role)?.libelle}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-approved/15 text-approved rounded-sm"
                    >
                      {item.etatCompte}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-end justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
