import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, pathForRole } from "../auth";
import "./login.css";

const DEMOS = {
  admin:    { email: "admin@uni.com",  password: "admin123", label: "Admin" },
  faculty:  { email: "smith@uni.com",  password: "pass",     label: "Instructor" },
  student:  { email: "studA@uni.com",  password: "pass",     label: "Student" },
};

export default function Login() {
  const nav = useNavigate();

  const [picked, setPicked]   = useState("student");
  const [email, setEmail]     = useState(DEMOS.student.email);
  const [password, setPassword] = useState(DEMOS.student.password);
  const [show, setShow]       = useState(false);
  const [err, setErr]         = useState("");

  const doLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const u = await login(email, password);
      nav(pathForRole(u.role), { replace: true });
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Unauthorized");
    }
  };

  const quickPick = (who) => {
    const d = DEMOS[who];
    setPicked(who);
    setEmail(d.email);
    setPassword(d.password);
  };

  const onEmailChange = (v) => {
    setEmail(v);
    // if user edits email manually, clear visual selection
    if (picked) setPicked(null);
  };

  return (
    <div className="login-bg">
      <div className="login__wrap">
        <form className="login__card" onSubmit={doLogin}>
          <div className="login__brand">UNI COURSE MANAGER</div>

          <h2 className="login__title">Welcome Back</h2>
          <h3 className="login__sub">Sign in to your university account</h3>

          <label className="login__label" htmlFor="email">Email</label>
          <div className="login__field">
            <input
              id="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="name@uni.com"
              type="email"
              required
              aria-label="Email"
            />
          </div>

          <label className="login__label" htmlFor="password">Password</label>
          <div className="login__field">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              required
              aria-label="Password"
            />
            <button
              type="button"
              className="login__toggle"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              title={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {err && <div className="login__error">{err}</div>}

          <button className="login__btn" type="submit">Sign In</button>

          <div className="login__divider" />

          <div className="login__quick" role="group" aria-label="Demo accounts">
            <button
              type="button"
              className={`login__quickBtn ${picked === "admin" ? "is-selected" : ""}`}
              aria-pressed={picked === "admin"}
              onClick={() => quickPick("admin")}
            >
              Admin
            </button>
            <button
              type="button"
              className={`login__quickBtn ${picked === "faculty" ? "is-selected" : ""}`}
              aria-pressed={picked === "faculty"}
              onClick={() => quickPick("faculty")}
            >
              Instructor
            </button>
            <button
              type="button"
              className={`login__quickBtn ${picked === "student" ? "is-selected" : ""}`}
              aria-pressed={picked === "student"}
              onClick={() => quickPick("student")}
            >
              Student
            </button>
          </div>

          <p className="signup-hint">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
