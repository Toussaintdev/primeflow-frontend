"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  CircleCheck,
  Loader2,
  Plus,
  RefreshCw,
  TriangleAlert,
  Unlock,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable, type DataTableColumn } from "@/components/custom/DataTable";
import {
  TrancheMatrixBuilder,
  ligneVide,
  type LigneTranche,
} from "@/components/custom/TrancheMatrixBuilder";
import {
  createPeriodeCalcul,
  createRegleCalcul,
  createRole,
  getCategories,
  getObjectifs,
  getPeriodesCalcul,
  getReglesCalcul,
  getRoles,
  getUtilisateurConnecte,
  getUtilisateurs,
  importEmployesFichier,
  register,
  unlockUtilisateur,
  updatePeriodeCalcul,
} from "@/lib/api";
import { roleToKey } from "@/constants/access";
import {
  formatDate,
  STATUT_PERIODE_LABELS,
  STATUT_PERIODE_STYLES,
} from "@/lib/format";

export default function ParametresPage() {
  const [roleLabel, setRoleLabel] = React.useState("");
  const [loadingRole, setLoadingRole] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getUtilisateurConnecte(), getRoles()])
      .then(([user, roles]) => {
        setRoleLabel(roles.find((r) => r.code === user.role)?.libelle ?? "");
      })
      .catch(() => {})
      .finally(() => setLoadingRole(false));
  }, []);

  const estAdmin = roleToKey(roleLabel) === "admin";

  if (loadingRole) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Import des employés, gestion des accès, périodes et règles de calcul.
        </p>
      </div>

      <Tabs defaultValue="import">
        <TabsList>
          <TabsTrigger value="import">Import employés</TabsTrigger>
          {estAdmin && (
            <TabsTrigger value="utilisateurs">
              Utilisateurs et rôles
            </TabsTrigger>
          )}
          <TabsTrigger value="periodes">Période de calcul</TabsTrigger>
          <TabsTrigger value="regles">Règle de calcul</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-4">
          <OngletImportEmployes />
        </TabsContent>

        {estAdmin && (
          <TabsContent value="utilisateurs" className="mt-4">
            <OngletUtilisateursRoles />
          </TabsContent>
        )}

        <TabsContent value="periodes" className="mt-4">
          <OngletPeriodeCalcul />
        </TabsContent>

        <TabsContent value="regles" className="mt-4">
          <OngletRegleCalcul />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OngletImportEmployes() {
  const [fichier, setFichier] = React.useState<File | null>(null);
  const [envoi, setEnvoi] = React.useState(false);
  const [resultat, setResultat] = React.useState<{
    crees: number;
    misAJour: number;
    ignores: number;
  } | null>(null);

  async function envoyer() {
    if (!fichier) return;
    setEnvoi(true);
    setResultat(null);
    try {
      const res = await importEmployesFichier(fichier);
      setResultat(res as { crees: number; misAJour: number; ignores: number });
      toast.success("Import terminé.");
      setFichier(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <Card className="p-6 space-y-4 max-w-xl">
      <div>
        <p className="font-semibold">
          Importer les employés depuis un fichier Excel
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Le fichier doit contenir les colonnes <code>matricule</code>,{" "}
          <code>nom</code>, <code>prenom</code> et <code>categorie</code>. Un
          employé déjà existant (même matricule) est mis à jour plutôt que
          dupliqué.
        </p>
      </div>
      <Input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFichier(e.target.files?.[0] ?? null)}
      />
      <Button onClick={envoyer} disabled={!fichier || envoi}>
        <Upload className="mr-2 h-4 w-4" />
        {envoi ? "Iemport en cours…" : "Importer"}
      </Button>

      {resultat && (
        <div className="text-sm rounded-lg border p-3 space-y-1">
          <p className="flex items-center gap-2">
            <CircleCheck className="h-4 w-4 text-green-600 shrink-0" />
            <span>{resultat.crees} employé(s) créé(s)</span>
          </p>
          <p className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-600 shrink-0" />
            <span>{resultat.misAJour} employé(s) mis à jour</span>
          </p>
          {resultat.ignores > 0 && (
            <p className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <span>{resultat.ignores} ligne(s) ignorée(s)</span>
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function OngletUtilisateursRoles() {
  const [utilisateurs, setUtilisateurs] = React.useState<UserType[]>([]);
  const [roles, setRoles] = React.useState<RoleType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogUtilisateurOuvert, setDialogUtilisateurOuvert] =
    React.useState(false);
  const [dialogRoleOuvert, setDialogRoleOuvert] = React.useState(false);
  const [nouvelUtilisateur, setNouvelUtilisateur] = React.useState({
    username: "",
    email: "",
    role: "",
  });
  const [nouveauRole, setNouveauRole] = React.useState({
    libelle: "",
    description: "",
  });
  const [envoi, setEnvoi] = React.useState(false);

  async function charger() {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([getUtilisateurs(), getRoles()]);
      setUtilisateurs(u);
      setRoles(r);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    charger();
  }, []);

  const roleLibelle = (code: string) =>
    roles.find((r) => r.code === code)?.libelle ?? code;

  async function creerUtilisateur() {
    setEnvoi(true);
    try {
      await register(
        nouvelUtilisateur.username,
        nouvelUtilisateur.email,
        nouvelUtilisateur.role,
      );
      toast.success(
        "Utilisateur créé. Un mot de passe temporaire lui a été attribué.",
      );
      setDialogUtilisateurOuvert(false);
      setNouvelUtilisateur({ username: "", email: "", role: "" });
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  async function creerRole() {
    setEnvoi(true);
    try {
      await createRole(nouveauRole.libelle, nouveauRole.description);
      toast.success("Rôle créé.");
      setDialogRoleOuvert(false);
      setNouveauRole({ libelle: "", description: "" });
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  async function debloquer(id: string) {
    try {
      await unlockUtilisateur(id);
      toast.success("Compte débloqué.");
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const columns: DataTableColumn<UserType>[] = [
    {
      id: "username",
      header: "Nom d'utilisateur",
      cell: (r) => r.username,
      searchValue: (r) => r.username,
      sortValue: (r) => r.username,
    },
    { id: "email", header: "Email", cell: (r) => r.email },
    {
      id: "role",
      header: "Rôle",
      cell: (r) => <Badge variant="secondary">{roleLibelle(r.role)}</Badge>,
    },
    {
      id: "etat",
      header: "État",
      cell: (r) => (
        <Badge
          className={
            r.etatCompte === "Actif"
              ? "bg-success/20 text-success"
              : r.etatCompte === "Bloque"
                ? "bg-destructive/20 text-destructive"
                : "bg-muted text-muted-foreground"
          }
        >
          {r.etatCompte}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: (r) =>
        r.etatCompte === "Bloque" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => debloquer(r.idUtilisateur)}
          >
            <Unlock className="mr-2 h-3.5 w-3.5" /> Débloquer
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <p className="font-semibold">Utilisateurs</p>
        <div className="flex gap-2">
          {/* <Dialog open={dialogRoleOuvert} onOpenChange={setDialogRoleOuvert}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Nouveau rôle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un rôle</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Libellé</Label>
                  <Input
                    value={nouveauRole.libelle}
                    onChange={(e) =>
                      setNouveauRole({
                        ...nouveauRole,
                        libelle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={nouveauRole.description}
                    onChange={(e) =>
                      setNouveauRole({
                        ...nouveauRole,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={creerRole}
                  disabled={envoi || !nouveauRole.libelle}
                >
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}

          <Dialog
            open={dialogUtilisateurOuvert}
            onOpenChange={setDialogUtilisateurOuvert}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un utilisateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nom d'utilisateur</Label>
                  <Input
                    value={nouvelUtilisateur.username}
                    onChange={(e) =>
                      setNouvelUtilisateur({
                        ...nouvelUtilisateur,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={nouvelUtilisateur.email}
                    onChange={(e) =>
                      setNouvelUtilisateur({
                        ...nouvelUtilisateur,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select
                    value={nouvelUtilisateur.role}
                    onValueChange={(v) =>
                      setNouvelUtilisateur({ ...nouvelUtilisateur, role: v })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.code} value={r.code}>
                          {r.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={creerUtilisateur}
                  disabled={
                    envoi ||
                    !nouvelUtilisateur.username ||
                    !nouvelUtilisateur.email ||
                    !nouvelUtilisateur.role
                  }
                >
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={utilisateurs}
        loading={loading}
        searchable
        getRowId={(r) => r.idUtilisateur}
        searchPlaceholder="Rechercher un utilisateur…"
      />
    </div>
  );
}

function OngletPeriodeCalcul() {
  const [periodes, setPeriodes] = React.useState<PeriodeCalculType[]>([]);
  const [regles, setRegles] = React.useState<RegleCalculType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOuvert, setDialogOuvert] = React.useState(false);
  const [form, setForm] = React.useState({
    dateDebut: "",
    dateFin: "",
    regleCalcul: "",
  });
  const [envoi, setEnvoi] = React.useState(false);

  async function charger() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        getPeriodesCalcul(),
        getReglesCalcul(),
      ]);
      setPeriodes(p);
      setRegles(r);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    charger();
  }, []);

  async function creer() {
    setEnvoi(true);
    try {
      await createPeriodeCalcul({
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        regleCalcul: form.regleCalcul || null,
      });
      toast.success(
        form.regleCalcul
          ? "Période créée et règle liée."
          : "Période créée. Aucune règle liée pour l'instant — le calcul sera bloqué tant qu'aucune règle n'est associée.",
      );
      setDialogOuvert(false);
      setForm({ dateDebut: "", dateFin: "", regleCalcul: "" });
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  async function lierRegle(periode: PeriodeCalculType, regleCalcul: string) {
    try {
      await updatePeriodeCalcul(periode.idPeriode, { regleCalcul });
      toast.success("Règle liée à la période.");
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const columns: DataTableColumn<PeriodeCalculType>[] = [
    {
      id: "dates",
      header: "Période",
      cell: (r) => `${formatDate(r.dateDebut)} – ${formatDate(r.dateFin)}`,
      sortValue: (r) => r.dateDebut,
    },
    {
      id: "statut",
      header: "Statut",
      cell: (r) => (
        <Badge className={STATUT_PERIODE_STYLES[r.statut]} variant="secondary">
          {STATUT_PERIODE_LABELS[r.statut]}
        </Badge>
      ),
    },
    {
      id: "regle",
      header: "Règle de calcul",
      cell: (r) =>
        r.statut !== "Ouverte" ? (
          (r.regleCalcul_libelle ?? "—")
        ) : (
          <Select
            value={r.regleCalcul ?? ""}
            onValueChange={(v) => lierRegle(r, v)}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Aucune règle liée" />
            </SelectTrigger>
            <SelectContent>
              {regles.map((regle) => (
                <SelectItem key={regle.idRegle} value={regle.idRegle}>
                  {regle.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOuvert} onOpenChange={setDialogOuvert}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle période
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une période de calcul</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date de début</Label>
                  <Input
                    type="date"
                    value={form.dateDebut}
                    onChange={(e) =>
                      setForm({ ...form, dateDebut: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    value={form.dateFin}
                    onChange={(e) =>
                      setForm({ ...form, dateFin: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>
                  Règle de calcul (optionnel — peut être liée plus tard)
                </Label>
                <Select
                  value={form.regleCalcul}
                  onValueChange={(v) => setForm({ ...form, regleCalcul: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Aucune pour l'instant" />
                  </SelectTrigger>
                  <SelectContent>
                    {regles.map((regle) => (
                      <SelectItem key={regle.idRegle} value={regle.idRegle}>
                        {regle.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={creer}
                disabled={envoi || !form.dateDebut || !form.dateFin}
              >
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={periodes}
        loading={loading}
        getRowId={(r) => r.idPeriode}
        emptyMessage="Aucune période de calcul créée."
      />
    </div>
  );
}

function OngletRegleCalcul() {
  const [regles, setRegles] = React.useState<RegleCalculType[]>([]);
  const [categories, setCategories] = React.useState<CategorieType[]>([]);
  const [objectifs, setObjectifsState] = React.useState<ObjectifType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOuvert, setDialogOuvert] = React.useState(false);
  const [envoi, setEnvoi] = React.useState(false);

  const [libelle, setLibelle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [lignesCollectif, setLignesCollectif] = React.useState<LigneTranche[]>([
    ligneVide(),
  ]);
  const [lignesParCategorie, setLignesParCategorie] = React.useState<
    Record<string, LigneTranche[]>
  >({});

  async function charger() {
    setLoading(true);
    try {
      const [r, c, o] = await Promise.all([
        getReglesCalcul(),
        getCategories(),
        getObjectifs(),
      ]);
      setRegles(r);
      setCategories(c);
      setObjectifsState(o);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    charger();
  }, []);

  function ouvrirDialog() {
    setLibelle("");
    setDescription("");
    setLignesCollectif([ligneVide()]);
    const init: Record<string, LigneTranche[]> = {};
    categories.forEach((cat) => {
      init[cat.code] = [ligneVide()];
    });
    setLignesParCategorie(init);
    setDialogOuvert(true);
  }

  const objectifCollectif =
    objectifs.find((o) => o.typeObjectif === "Collectif") ?? null;
  const objectifParCategorie = (code: string) =>
    objectifs.find(
      (o) =>
        o.typeObjectif === "Individuel" && o.categorieProfessionnelle === code,
    ) ?? null;

  function lignesValides(lignes: LigneTranche[]) {
    return lignes.filter(
      (l) =>
        l.nombreMouvementMax !== "" &&
        l.ggmphMax !== "" &&
        l.montantPrime !== "",
    );
  }

  async function soumettre() {
    setEnvoi(true);
    try {
      const tranches = [
        ...lignesValides(lignesCollectif).map((l) => ({
          typeTranche: "Collective" as const,
          nombreMouvementMin: Number(l.nombreMouvementMin),
          nombreMouvementMax: Number(l.nombreMouvementMax),
          ggmphMin: Number(l.ggmphMin),
          ggmphMax: Number(l.ggmphMax),
          montantPrime: Number(l.montantPrime),
          description: l.description,
          categorieProfessionnelle: null,
        })),
        ...Object.entries(lignesParCategorie).flatMap(([code, lignes]) =>
          lignesValides(lignes).map((l) => ({
            typeTranche: "Individuelle" as const,
            nombreMouvementMin: Number(l.nombreMouvementMin),
            nombreMouvementMax: Number(l.nombreMouvementMax),
            ggmphMin: Number(l.ggmphMin),
            ggmphMax: Number(l.ggmphMax),
            montantPrime: Number(l.montantPrime),
            description: l.description,
            categorieProfessionnelle: code,
          })),
        ),
      ];

      if (tranches.length === 0) {
        toast.error(
          "Ajoutez au moins une tranche (collective ou individuelle) avant de valider.",
        );
        setEnvoi(false);
        return;
      }

      await createRegleCalcul({ libelle, description, tranches });
      toast.success("Règle de calcul créée.");
      setDialogOuvert(false);
      charger();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }

  const columns: DataTableColumn<RegleCalculType>[] = [
    {
      id: "libelle",
      header: "Libellé",
      cell: (r) => r.libelle,
      sortValue: (r) => r.libelle,
    },
    {
      id: "description",
      header: "Description",
      cell: (r) => r.description || "—",
    },
    {
      id: "tranches",
      header: "Tranches",
      cell: (r) => <Badge variant="secondary">{r.tranches?.length ?? 0}</Badge>,
    },
    {
      id: "dateCreation",
      header: "Créée le",
      cell: (r) => formatDate(r.dateCreation),
      sortValue: (r) => r.dateCreation,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOuvert} onOpenChange={setDialogOuvert}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={ouvrirDialog}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle règle de calcul
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une règle de calcul</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Libellé</Label>
                  <Input
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">
                  Tranches collectives (par navire)
                </p>
                <TrancheMatrixBuilder
                  titre="Prime collective"
                  cible={
                    objectifCollectif
                      ? {
                          nombreMouvement: objectifCollectif.nombreMouvement,
                          ggmph: Number(objectifCollectif.ggmph),
                        }
                      : null
                  }
                  lignes={lignesCollectif}
                  onChange={setLignesCollectif}
                />
              </div>

              <div className="space-y-3">
                <p className="font-semibold">
                  Tranches individuelles, par catégorie professionnelle
                </p>
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Aucune catégorie professionnelle enregistrée.
                  </p>
                )}
                {categories.map((cat) => {
                  const objectif = objectifParCategorie(cat.code);
                  return (
                    <TrancheMatrixBuilder
                      key={cat.code}
                      titre={cat.libelle}
                      cible={
                        objectif
                          ? {
                              nombreMouvement: objectif.nombreMouvement,
                              ggmph: Number(objectif.ggmph),
                            }
                          : null
                      }
                      lignes={lignesParCategorie[cat.code] ?? [ligneVide()]}
                      onChange={(lignes) =>
                        setLignesParCategorie((prev) => ({
                          ...prev,
                          [cat.code]: lignes,
                        }))
                      }
                    />
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button onClick={soumettre} disabled={envoi || !libelle}>
                {envoi ? "Création…" : "Créer la règle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={regles}
        loading={loading}
        searchable
        getRowId={(r) => r.idRegle}
        searchPlaceholder="Rechercher une règle…"
        emptyMessage="Aucune règle de calcul créée."
      />
    </div>
  );
}
