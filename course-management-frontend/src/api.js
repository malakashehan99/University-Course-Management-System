import axios from "axios";
import { getToken, logout } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

function normalizeIds(obj) {
  if (Array.isArray(obj)) return obj.map(normalizeIds);
  if (obj && typeof obj === "object") {
    const m = { ...obj };

   
    if (m.courseId != null && m.id == null) m.id = m.courseId;
    if (m.userId != null && m.id == null) m.id = m.userId;
    if (m.resultId != null && m.id == null) m.id = m.resultId;
    if (m.enrollmentId != null && m.id == null) m.id = m.enrollmentId;

    
    if (m.course) m.course = normalizeIds(m.course);
    if (m.student) m.student = normalizeIds(m.student);
    if (m.faculty) m.faculty = normalizeIds(m.faculty);

  
    for (const k of Object.keys(m)) {
      const v = m[k];
      if (v && typeof v === "object") m[k] = normalizeIds(v);
    }
    return m;
  }
  return obj;
}

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => {
    if (r && r.data !== undefined) r.data = normalizeIds(r.data);
    return r;
  },
  (err) => {
    if (err?.response?.status === 401) {
      logout();
    }
    
    if (err?.response?.data?.error && !err.messageShown) {
      err.messageShown = true;
      err.message = err.response.data.error;
    }
    return Promise.reject(err);
  }
);

export default api;