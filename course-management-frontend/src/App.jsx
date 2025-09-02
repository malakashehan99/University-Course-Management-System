import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { getUser, isAuthed, pathForRole } from "./auth";
import "./index.css";

function RequireAuth({ children, role }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  const u = getUser();
  if (role && u.role !== role) return <Navigate to={pathForRole(u.role)} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/student"
          element={
            <RequireAuth role="STUDENT">
              <StudentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/faculty"
          element={
            <RequireAuth role="FACULTY">
              <FacultyDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth role="ADMIN">
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}


