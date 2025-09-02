import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, isAuthed, logout, pathForRole } from "../auth";
import { FaGraduationCap } from "react-icons/fa6";
import "./Nav.css";

export default function Nav() {
  const nav = useNavigate();
  const loc = useLocation();
  const user = getUser();

  const doLogout = () => {
    logout();
    nav("/");
  };

  const goHome = () => {
    if (isAuthed()) nav(pathForRole(user.role));
    else nav("/");
  };

  return (
    <header className="topbar">
      <div className="topbar__left" />
      <div className="topbar__center" onClick={goHome} role="button">
        <span className="logo"><FaGraduationCap /></span>
        <span className="brand">
          <strong>Uni</strong> <span>Course</span> <em>Manager</em>
        </span>
      </div>
      <div className="topbar__right">
        {!isAuthed() ? (
          loc.pathname !== "/" && <Link className="topbar__link" to="/">Login</Link>
        ) : (
          <>
            <span className="userpill">{user?.fullName || user?.email}</span>
            <button className="logout" onClick={doLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

