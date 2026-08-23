type RoleType = {
  code: string;
  libelle: string;
  description: string;
};

type UserType = {
  idUtilisateur: string;
  username: string;
  email: string;
  date_joined: string;
  etatCompte: string;
  nombreTentatives: number;
  doitChangerMotDePasse: boolean;
  role: string;
};

type EmployeType = {
  idEmploye: string;
  nom: string;
  prenom: string;
  categorieProfessionnelle: string;
};

type CategorieType = {
  code: string;
  libelle: string;
  description: string;
};

type ObjectifType = {
  code: string;
  nombreMouvement: number;
  ggmph: string;
  typeObjectif: "Individuel" | "Collectif";
  categorieProfessionnelle: string | null;
  categorieProfessionnelle_libelle: string | null;
};

type PerformanceType = {
  code: string;
  typePerformance: "Individuelle" | "Navire" | "Collective";
  nombreMouvement: number;
  gmph: string;
  ggmph: string;
  employe: string | null;
  employe_nom: string | null;
  navire: string | null;
  navire_nom: string | null;
  periodeCalcul: string;
  dateCalcul: string;
};

type TrancheRegleInput = {
  typeTranche: "Individuelle" | "Collective";
  nombreMouvementMin: number;
  nombreMouvementMax: number;
  ggmphMin: number;
  ggmphMax: number;
  montantPrime: number;
  description?: string;
  categorieProfessionnelle?: string | null;
};

type TrancheRegleType = TrancheRegleInput & {
  idTranche: string;
  categorieProfessionnelle_libelle: string | null;
  regleCalcul: string;
};

type RegleCalculType = {
  idRegle: string;
  libelle: string;
  description: string;
  dateCreation: string;
  tranches: TrancheRegleType[];
};

type PeriodeCalculType = {
  idPeriode: string;
  dateDebut: string;
  dateFin: string;
  statut: "Ouverte" | "Calculee" | "Cloturee";
  dateCreation: string;
  regleCalcul: string | null;
  regleCalcul_libelle: string | null;
};

type CalculPrimeType = {
  idPrime: string;
  montantIndividuel: string;
  montantCollectif: string;
  montantTotal: string;
  dateCalcul: string;
  employe: string;
  employe_nom: string;
  categorieProfessionnelle: string | null;
  periodeCalcul: string;
};

type RapportType = {
  idRapport: string;
  fichier: string | null;
  nomFichier: string | null;
  type: "Primes" | "Performance" | "Audit";
  periodeCalcul: string | null;
  periodeLabel: string | null;
  genereePar: string | null;
  genereePar_nom: string | null;
  dateCreation: string;
};

type JournalAuditType = {
  idJournal: string;
  action: string;
  objet: string;
  resultat: string;
  adresseIP: string | null;
  dateJournal: string;
  utilisateur: string | null;
  utilisateur_id: string | null;
  utilisateur_nom: string | null;
};
