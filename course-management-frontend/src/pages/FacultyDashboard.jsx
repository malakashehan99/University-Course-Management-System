import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { getUser } from "../auth";
import "./dash.css";

export default function FacultyDashboard() {
  const user = getUser();
  const [courses, setCourses] = useState([]);
  const [pick, setPick] = useState("");
  const [enrolled, setEnrolled] = useState([]);
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({ studentId: "", marks: "", grade: "" });
  const [update, setUpdate] = useState({ resultId: "", marks: "", grade: "" });
  const [msg, setMsg] = useState("");

  const myCourses = useMemo(
    () => courses.filter((c) => `${c?.faculty?.id}` === `${user.id}`),
    [courses, user.id]
  );

  const loadAll = async () => {
    const { data: all } = await api.get("/api/courses");
    setCourses(all || []);
  };
  const loadCourseData = async (cid) => {
    if (!cid) return;
    const [e, r] = await Promise.all([
      api.get(`/api/enrollments/by-course/${cid}`),
      api.get(`/api/results/by-course/${cid}`),
    ]);
    setEnrolled(e.data || []);
    setResults(r.data || []);
  };

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { setMsg(""); loadCourseData(pick); }, [pick]);

  const uploadResult = async () => {
    try {
      await api.post("/api/results", {
        studentId: +form.studentId,
        courseId: +pick,
        marks: form.marks ? +form.marks : null,
        grade: form.grade || null,
      });
      setForm({ studentId: "", marks: "", grade: "" });
      await loadCourseData(pick);
      setMsg("Result uploaded.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  const patchResult = async () => {
  try {
    const id = Number(update.resultId);
    const marks = update.marks !== "" ? Number(update.marks) : null;
    const grade = update.grade || null;

    if (!id) throw new Error("Result ID is required");

    const qs = new URLSearchParams();
    if (marks !== null && Number.isFinite(marks)) qs.append("marks", String(marks));
    if (grade) qs.append("grade", grade);

    await api.patch(`/api/results/${id}?${qs.toString()}`);

    setUpdate({ resultId: "", marks: "", grade: "" });
    await loadCourseData(pick);
    setMsg("Result updated.");
  } catch (e) {
    setMsg(e?.response?.data?.error || e?.response?.data?.message || e.message);
  }
};


  return (
    <div className="page">
      <section className="hero">
        <h1>Faculty Dashboard</h1>
        <div className="meta">
          <div><b>Instructor Email:</b> {user.email}</div>
          <div><b>Instructor ID:</b> <span className="pill">{user.id}</span></div>
        </div>
        {msg && <div className="note">{msg}</div>}
      </section>

      <div className="card">
        <h3>My Courses</h3>
        <select value={pick} onChange={(e) => setPick(e.target.value)} style={{maxWidth: 360}}>
          <option value="">Select a course</option>
          {myCourses.map((c) => (
            <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
          ))}
        </select>
      </div>

      <div className="grid2">

        <div className="card">
          <h3>Enrolled Students</h3>
          <table>
            <thead><tr><th>Student</th><th>Status</th></tr></thead>
            <tbody>
              {enrolled.map((e) => (
                <tr key={e.id}>
                  <td>{e?.student?.fullName} ({e?.student?.email})</td>
                  <td>{e?.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Results for Course</h3>
          <table>
            <thead><tr><th>Student</th><th>Marks</th><th>Grade</th><th>Result ID</th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r?.student?.fullName}</td>
                  <td>{r?.marks ?? "-"}</td>
                  <td>{r?.grade ?? "-"}</td>
                  <td className="muted">{r.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="grid2">
        <div className="card">
          <h3>Upload Result</h3>
          <div className="row">
            <input placeholder="Student ID" value={form.studentId} onChange={(e)=>setForm({...form,studentId:e.target.value})} />
            <input placeholder="Marks" value={form.marks} onChange={(e)=>setForm({...form,marks:e.target.value})} />
            <input placeholder="Grade (A/B/C…)" value={form.grade} onChange={(e)=>setForm({...form,grade:e.target.value})} />
            <button onClick={uploadResult} disabled={!pick}>Upload</button>
          </div>
        </div>

        <div className="card">
          <h3>Update Result</h3>
          <div className="row">
            <input placeholder="Result ID" value={update.resultId} onChange={(e)=>setUpdate({...update,resultId:e.target.value})} />
            <input placeholder="Marks" value={update.marks} onChange={(e)=>setUpdate({...update,marks:e.target.value})} />
            <input placeholder="Grade" value={update.grade} onChange={(e)=>setUpdate({...update,grade:e.target.value})} />
            <button onClick={patchResult}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}

