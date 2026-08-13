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
