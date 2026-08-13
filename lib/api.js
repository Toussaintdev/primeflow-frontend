const API_URL = process.env.NEXT_PUBLIC_API_URL;

// la fonction centrale que les autres fonctions vont utiliser
async function apiCall(endpoint, options = {}) {
  if (typeof window === "undefined")
    throw new Error("API appelé coté serveur.");
  const accessToken = localStorage.getItem("access_token");
  const config = {
    headers: {
      "Content-type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiCall(endpoint, options);
    }
    logout();
    throw new Error("Session expirée, reconnectez vous.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
}

// les requettes pour l'authentification
export async function register(username, email, role) {
  return apiCall("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ username, email, role }),
  });
}

export async function login(idUtilisateur, password) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ idUtilisateur, password }),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function refreshToken() {
  if (typeof window === "undefined") return false;
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;
  try {
    const response = await fetch(`${API_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    const data = await response.json();
    if (!data.access) return false;
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return true;
  } catch {
    return false;
  }
}

export function isLogin() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}

// recupération de l'utilisateur connecté
export const getUtilisateurConnecte = () => apiCall("/auth/users/me/");

// réinitialisation du mot de passe
export async function resetPassord(
  ancien_mot_de_passe,
  nouveau_mot_de_passe,
  confirmation_mot_de_passe,
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

// utilisateurs
export const getUtilisateurs = () => apiCall("/auth/users/");

export const getUtilisateur = (idUtilisateur) =>
  apiCall(`/auth/users/${idUtilisateur}/`);

// débloqu" un compte
export const unlockUtilisateur = (idUtilisateur) =>
  apiCall(`/auth/users/${idUtilisateur}/unlock/`, { method: "POST" });

// export const updateUtilisateur = (idUtilisateur) =>
//   apiCall(`/auth/users/${idUtilisateur}`, { method: "PATCH", body: JSON.stringify() });

// Roles
export const getRoles = () => apiCall("/auth/roles/");
// export const getRole = () => {};
export const createRole = (libelle, description) =>
  apiCall("/auth/roles/", {
    method: "POST",
    body: JSON.stringify({ libelle, description }),
  });

// employés
export const getEmployes = () => apiCall("/employes/");
export const getEmploye = () => {};

// Catégorie professionnelle
export const getCategories = () => apiCall("/employes/categories/all/");
export const getCategorie = () => {};
