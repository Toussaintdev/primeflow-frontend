const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type ApiOptions = RequestInit & { skipRefresh?: boolean };

let refreshing: Promise<boolean> | null = null;

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getErrorMessage(
  data: unknown,
  fallback = "Une erreur est survenue. Veuillez réessayer.",
) {
  if (!data) return fallback;
  if (typeof data === "string") {
    // Une page d'erreur Django brute (HTML) a été renvoyée au lieu de JSON :
    // on ne l'affiche jamais telle quelle à l'utilisateur.
    const ressembleAHtml = /<\/?[a-z][\s\S]*>/i.test(data);
    if (ressembleAHtml || data.trim().length === 0) return fallback;
    return data;
  }
  if (typeof data !== "object") return fallback;

  const value = data as Record<string, unknown>;
  if (typeof value.detail === "string") return value.detail;
  if (typeof value.message === "string") return value.message;

  for (const item of Object.values(value)) {
    if (Array.isArray(item) && item.length) return String(item[0]);
    if (typeof item === "string") return item;
  }
  return fallback;
}

export async function refreshToken() {
  if (typeof window === "undefined") return false;
  if (refreshing) return refreshing;

  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;

  refreshing = fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })
    .then(async (response) => {
      if (!response.ok) return false;
      const data = await response.json();
      if (!data?.access) return false;
      localStorage.setItem("access_token", data.access);
      if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.replace("/login/");
}

export function isLogin() {
  return typeof window !== "undefined" && !!getAccessToken();
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (typeof window === "undefined") {
    throw new Error("API appelée côté serveur.");
  }
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL n'est pas configurée.");

  const { skipRefresh, ...fetchOptions } = options;
  const token = getAccessToken();
  const isFormData = fetchOptions.body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
    );
  }

  if (
    response.status === 401 &&
    !skipRefresh &&
    !endpoint.includes("/login/") &&
    !endpoint.includes("/refresh/")
  ) {
    if (await refreshToken()) {
      return apiCall<T>(endpoint, { ...options, skipRefresh: true });
    }
    logout();
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const error = new Error(getErrorMessage(data));
    (error as Error & { data?: unknown; status?: number }).data = data;
    (error as Error & { data?: unknown; status?: number }).status =
      response.status;
    throw error;
  }

  if (response.status === 204) return null as T;
  return data as T;
}

export async function login(idUtilisateur: string, password: string) {
  const data = await apiCall<{
    access: string;
    refresh: string;
    must_change_password?: boolean;
  }>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ idUtilisateur, password }),
    skipRefresh: true,
  });

  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export const getUtilisateurConnecte = () =>
  apiCall<UserType>("/auth/users/me/");
export const me = getUtilisateurConnecte;

export async function resetPassord(
  ancien_mot_de_passe: string,
  nouveau_mot_de_passe: string,
  confirmation_mot_de_passe: string,
) {
  return apiCall("/auth/users/me/reset-password/", {
    method: "POST",
    body: JSON.stringify({
      ancien_mot_de_passe,
      nouveau_mot_de_passe,
      confirmation_mot_de_passe,
    }),
  });
}

export const register = (username: string, email: string, role: string) =>
  apiCall("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, role }),
  });

export const getUtilisateurs = (q = "") =>
  apiCall<UserType[]>(`/auth/users/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const users = getUtilisateurs;

export const getUtilisateur = (id: string) =>
  apiCall<UserType>(`/auth/users/${encodeURIComponent(id)}/`);
export const updateUtilisateur = (id: string, data: Record<string, unknown>) =>
  apiCall(`/auth/users/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteUtilisateur = (id: string) =>
  apiCall(`/auth/users/${encodeURIComponent(id)}/`, { method: "DELETE" });
export const unlockUtilisateur = (id: string) =>
  apiCall(`/auth/users/${encodeURIComponent(id)}/unlock/`, { method: "POST" });
export const unlockUser = unlockUtilisateur;

export const getRoles = (q = "") =>
  apiCall<RoleType[]>(`/auth/roles/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const roles = getRoles;
export const createRole = (libelle: string, description: string) =>
  apiCall("/auth/roles/", {
    method: "POST",
    body: JSON.stringify({ libelle, description }),
  });

export const getEmployes = (q = "") =>
  apiCall<EmployeType[]>(`/employes/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const employees = getEmployes;
export const getEmploye = (id: string) =>
  apiCall<EmployeType>(`/employes/${encodeURIComponent(id)}/`);
export const getCategories = () =>
  apiCall<CategorieType[]>("/employes/categories/all/");
export const categories = getCategories;

export const createCategorie = (data: Record<string, unknown>) =>
  apiCall("/employes/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const importEmployesFichier = (fichier: File) => {
  const formData = new FormData();
  formData.append("fichier", fichier);
  return apiCall("/employes/importer/", {
    method: "POST",
    body: formData,
  });
};

export const getEquipements = (q = "") =>
  apiCall(`/operations/equipements/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const equipements = getEquipements;
export const createEquipement = (data: Record<string, unknown>) =>
  apiCall("/operations/equipements/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getNavires = (q = "") =>
  apiCall(`/operations/navires/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const navires = getNavires;
export const createNavire = (data: Record<string, unknown>) =>
  apiCall("/operations/navires/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPeriodesTravail = () =>
  apiCall("/operations/periodes-travail/");
export const periodesTravail = getPeriodesTravail;
export const createPeriodeTravail = (data: Record<string, unknown>) =>
  apiCall("/operations/periodes-travail/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMouvements = (q = "") =>
  apiCall(`/operations/mouvements/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const mouvements = getMouvements;
export const createMouvement = (data: Record<string, unknown>) =>
  apiCall("/operations/mouvements/", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ---- Objectifs & Performances ----

export const getObjectifs = (
  params: { typeObjectif?: string; q?: string } = {},
) => {
  const search = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return apiCall<ObjectifType[]>(
    `/performances/objectifs/${search ? `?${search}` : ""}`,
  );
};
export const objectifs = getObjectifs;
export const createObjectif = (data: Record<string, unknown>) =>
  apiCall("/performances/objectifs/", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateObjectif = (code: string, data: Record<string, unknown>) =>
  apiCall(`/performances/objectifs/${encodeURIComponent(code)}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteObjectif = (code: string) =>
  apiCall(`/performances/objectifs/${encodeURIComponent(code)}/`, {
    method: "DELETE",
  });

export const getPerformances = (
  params: { periodeCalcul?: string; typePerformance?: string; q?: string } = {},
) => {
  const search = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return apiCall<PerformanceType[]>(
    `/performances/performances/${search ? `?${search}` : ""}`,
  );
};
export const performances = getPerformances;

// ---- Règles de calcul & Tranches ----

export const getReglesCalcul = (q = "") =>
  apiCall<RegleCalculType[]>(
    `/regles/regles-calcul/${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  );
export const regles = getReglesCalcul;
export const getRegleCalcul = (id: string) =>
  apiCall<RegleCalculType>(`/regles/regles-calcul/${encodeURIComponent(id)}/`);

export const createRegleCalcul = (data: {
  libelle: string;
  description?: string;
  tranches?: TrancheRegleInput[];
}) =>
  apiCall<RegleCalculType>("/regles/regles-calcul/", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const createRegle = createRegleCalcul;

export const updateRegleCalcul = (
  id: string,
  data: {
    libelle?: string;
    description?: string;
    tranches?: TrancheRegleInput[];
  },
) =>
  apiCall<RegleCalculType>(`/regles/regles-calcul/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteRegleCalcul = (id: string) =>
  apiCall(`/regles/regles-calcul/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });

// ---- Périodes de calcul ----

export const getPeriodesCalcul = (q = "") =>
  apiCall<PeriodeCalculType[]>(
    `/regles/periodes-calcul/${q ? `?q=${encodeURIComponent(q)}` : ""}`,
  );
export const periodesCalcul = getPeriodesCalcul;

export const createPeriodeCalcul = (data: {
  dateDebut: string;
  dateFin: string;
  regleCalcul?: string | null;
}) =>
  apiCall<PeriodeCalculType>("/regles/periodes-calcul/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updatePeriodeCalcul = (
  id: string,
  data: Record<string, unknown>,
) =>
  apiCall<PeriodeCalculType>(
    `/regles/periodes-calcul/${encodeURIComponent(id)}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );

export const calculerPeriode = (id: string) =>
  apiCall(`/regles/periodes-calcul/${encodeURIComponent(id)}/calculer/`, {
    method: "POST",
  });

export const getPeriodesCalculPretes = () =>
  apiCall<PeriodeCalculType[]>("/regles/periodes-calcul/pretes/");

// ---- Primes ----

export const getPrimes = (
  params: { periodeCalcul?: string; q?: string } = {},
) => {
  const search = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return apiCall<CalculPrimeType[]>(
    `/regles/primes/${search ? `?${search}` : ""}`,
  );
};
export const primes = getPrimes;
export const getPrime = (id: string) =>
  apiCall<CalculPrimeType>(`/regles/primes/${encodeURIComponent(id)}/`);

// ---- Journal d'audit ----

export const getJournalAudit = (q = "") =>
  apiCall(`/audit/${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const audit = getJournalAudit;
export const getMesActivites = (limite = 5) =>
  apiCall<JournalAuditType[]>(`/audit/mes-activites/?limite=${limite}`);

// ---- Rapports ----

export const getRapports = () => apiCall<RapportType[]>("/rapports/");

export const genererRapportPrimes = (periodeId: string) =>
  apiCall<RapportType>(
    `/rapports/periodes-calcul/${encodeURIComponent(periodeId)}/generer-excel/`,
    { method: "POST" },
  );

export function urlFichierRapport(rapport: RapportType) {
  if (!rapport.fichier) return null;
  if (rapport.fichier.startsWith("http")) return rapport.fichier;
  const base = API_URL.replace(/\/api$/, "");
  return `${base}${rapport.fichier}`;
}
