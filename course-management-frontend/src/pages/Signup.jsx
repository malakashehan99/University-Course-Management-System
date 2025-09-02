import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../auth";
import "./login.css"; 

export default function Signup() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); 
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    try {
      await signup({ fullName, email, password, role });
      setOk("Account created! Please login.");
      setTimeout(() => nav("/"), 800);
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Failed to sign up");
    }
  };

  return (
    <div className="login-bg">
      <div className="login__wrap">
        <form className="login__card" onSubmit={submit}>
          
          <div className="login__brand">Uni Course Manager</div>

          <h2 className="login__title">Create Account</h2>
          <h3 className="login__sub">Join our university system</h3>

          <label className="login__label" htmlFor="fullName">Full Name</label>
          <div className="login__field">
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g., Student A"
              aria-label="Full Name"
            />
          </div>

          <label className="login__label" htmlFor="email">Email</label>
          <div className="login__field">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@uni.com"
              aria-label="Email"
            />
          </div>

          <label className="login__label" htmlFor="password">Password</label>
          <div className="login__field">
            <input
              id="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <label className="login__label" htmlFor="role">Role</label>
          <div className="login__field">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Role"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {err && <div className="login__error">{err}</div>}
          {ok && (
            <div
              className="login__error"
              style={{ borderColor: "#86efac", color: "#065f46", background: "#ecfdf5" }}
            >
              {ok}
            </div>
          )}

          <button className="login__btn" type="submit">Sign Up</button>

          <p className="signup-hint">
            Already have an account? <Link to="/">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
