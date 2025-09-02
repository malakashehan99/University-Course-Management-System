import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { getUser } from "../auth";
import "./dash.css";

export default function StudentDashboard() {
  const user = getUser(); // {id,email,role}
  const [courses, setCourses] = useState([]);
  const [pick, setPick] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");

  const reload = async () => {
    setMsg("");
    const [cRes, eRes, rRes] = await Promise.all([
      api.get("/api/courses"),
      api.get(`/api/enrollments/by-student/${user.id}`),
      api.get(`/api/results/by-student/${user.id}`),
    ]);
    setCourses(cRes.data || []);
    setEnrollments(eRes.data || []);
    setResults(rRes.data || []);
  };

  useEffect(() => { reload(); }, []);

  const selectedCourse = useMemo(
    () => courses.find((c) => `${c.id}` === `${pick}`),
    [courses, pick]
  );

  const enroll = async () => {
    if (!pick) return;
    try {
      await api.post("/api/enrollments", { studentId: user.id, courseId: +pick });
      setPick("");
      await reload();
      setMsg("Enrolled successfully.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const drop = async (courseId) => {
    try {
      await api.post(`/api/enrollments/drop?studentId=${user.id}&courseId=${courseId}`);
      await reload();
      setMsg("Dropped.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Student Dashboard</h1>
        <div className="meta">
          <div><b>Student Email:</b> {user.email}</div>
          <div><b>Student ID:</b> <span className="pill">{user.id}</span></div>
        </div>
        {msg && <div className="note">{msg}</div>}
      </section>

      <div className="grid2">
        <div className="card">
          <header>
            <h3>Browse Courses</h3>
            <div className="row">
              <select value={pick} onChange={(e) => setPick(e.target.value)}>
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
              <button onClick={enroll}>Enroll</button>
            </div>
          </header>
          <table>
            <thead>
              <tr><th>Code</th><th>Title</th><th>Capacity</th><th>Instructor</th></tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.title}</td>
                  <td>{c.capacity}</td>
                  <td>{c?.faculty?.fullName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stack">
          <div className="card">
            <h3>My Enrollments</h3>
            <table>
              <thead><tr><th>Course</th><th>Status</th><th /></tr></thead>
              <tbody>
                {enrollments.map((en) => (
                  <tr key={en.id}>
                    <td>{en?.course?.code} — {en?.course?.title}</td>
                    <td>{en?.status}</td>
                    <td>
                      {en?.status === "ENROLLED" && (
                        <button className="btn btn-danger btn-sm" onClick={() => drop(en?.course?.id)}> Drop </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>My Results</h3>
            <table>
              <thead><tr><th>Course</th><th>Marks</th><th>Grade</th></tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>{r?.course?.code} — {r?.course?.title}</td>
                    <td>{r?.marks ?? "-"}</td>
                    <td>{r?.grade ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
