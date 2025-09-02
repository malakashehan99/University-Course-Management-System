import { Navigate } from "react-router-dom";
import { isAuthed, getSelfCached } from "../auth";

export default function ProtectedRoute({ role, children }) {
  if (!isAuthed()) return <Navigate to="/" replace />;

  const self = getSelfCached();
  if (!self) return <Navigate to="/" replace />;

  
  if (role && self.role !== role) {
   
    const target =
      self.role === "ADMIN" ? "/admin" :
      self.role === "FACULTY" ? "/faculty" :
      "/student";
    return <Navigate to={target} replace />;
  }

  return children;
}
