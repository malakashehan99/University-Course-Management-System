import api from "./api";

/** token helpers */
const KEY = "ucm_token";
const USER_KEY = "ucm_user"; // {id,email,role,fullName}

export const saveToken = (token) => localStorage.setItem(KEY, token);
export const getToken = () => localStorage.getItem(KEY);
export const clearToken = () => localStorage.removeItem(KEY);

export const saveUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const clearUser = () => localStorage.removeItem(USER_KEY);

export const isAuthed = () => !!getToken() && !!getUser();
export const roleIs = (r) => (getUser()?.role || "") === r;

export const logout = () => {
  clearToken();
  clearUser();
};

/** decode JWT  */
function parseJwt(token) {
  try {
    const base = token.split(".")[1];
    const json = atob(base.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return {};
  }
}


async function resolveUserFromEmail(email) {
  const { data } = await api.get("/api/users");
  const u = data.find((x) => x.email?.toLowerCase() === email?.toLowerCase());
  if (!u) throw new Error("Login email not found in users");
  return { id: u.id || u.userId || u.user_id, email: u.email, role: u.role, fullName: u.fullName || u.name || u.full_name };
}

export async function login(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  const token = data?.token;
  if (!token) throw new Error("Invalid login response");
  saveToken(token);

  const sub = parseJwt(token)?.sub;
  const user = await resolveUserFromEmail(sub || email);
  saveUser(user);
  return user;
}

export async function signup({ fullName, email, password, role }) {
  const { data } = await api.post("/api/auth/signup", { fullName, email, password, role });
  return data;
}


export function pathForRole(role) {
  switch (role) {
    case "STUDENT": return "/student";
    case "FACULTY": return "/faculty";
    case "ADMIN":   return "/admin";
    default:        return "/";
  }
}

