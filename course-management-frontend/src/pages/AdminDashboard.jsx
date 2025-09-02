import { useEffect, useState } from "react";
import api from "../api";
import { getUser } from "../auth";
import "./dash.css";

export default function AdminDashboard() {
  const me = getUser();


  // data
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [faculties, setFaculties] = useState([]);

  // create form
  const [form, setForm] = useState({
    title: "",
    code: "",
    capacity: "",
    facultyId: "",
  });

  const [msg, setMsg] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    code: "",
    capacity: 40,
    facultyId: "",
  });

  // delete-confirm modal 
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    type: "",
    id: null,
    label: "", 
  });

  const labelRole = (r) => (r === "FACULTY" ? "INSTRUCTOR" : r);

  const load = async () => {
    const [c, u] = await Promise.all([
      api.get("/api/courses"),
      api.get("/api/users"),
    ]);
    setCourses(c.data || []);
    setUsers(u.data || []);
    setFaculties((u.data || []).filter((x) => x.role === "FACULTY"));
  };

  useEffect(() => {
    load();
  }, []);

  //  create
  const createCourse = async () => {
    try {
      const body = {
        title: form.title,
        code: form.code,
        capacity: +form.capacity,
        facultyId: form.facultyId ? +form.facultyId : null,
      };
      await api.post("/api/courses", body);
      setForm({ title: "", code: "", capacity: 40, facultyId: "" });
      await load();
      setMsg("Course created.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  //  assign instructor 
  const assign = async (courseId, facultyId) => {
    try {
      await api.post(`/api/courses/${courseId}/assign/${facultyId}`);
      await load();
      setMsg("Instructor assigned.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  //  delete 
  const askDeleteCourse = (c) => {
    setConfirmData({
      type: "course",
      id: c.id,
      label: `${c.code} — ${c.title}`,
    });
    setConfirmOpen(true);
  };

  const askDeleteUser = (u) => {
    setConfirmData({
      type: "user",
      id: u.id,
      label: `${u.fullName} (${u.email})`,
    });
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmData({ type: "", id: null, label: "" });
  };

  const confirmDelete = async () => {
    try {
      if (confirmData.type === "course") {
        await api.delete(`/api/courses/${confirmData.id}`);
      } else if (confirmData.type === "user") {
        await api.delete(`/api/users/${confirmData.id}`);
      }
      closeConfirm();
      await load();
      setMsg("Deleted successfully.");
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  // edit modal 
  const openEdit = (c) => {
    setEditForm({
      id: c.id,
      title: c.title,
      code: c.code,
      capacity: c.capacity,
      facultyId: c?.faculty?.id ?? "",
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditForm({
      id: null,
      title: "",
      code: "",
      capacity: 40,
      facultyId: "",
    });
  };

  const saveEdit = async () => {
    try {
      const body = {
        title: editForm.title,
        code: editForm.code,
        capacity: +editForm.capacity,
        facultyId: editForm.facultyId ? +editForm.facultyId : null,
      };
      await api.put(`/api/courses/${editForm.id}`, body);
      setMsg("Course updated.");
      closeEdit();
      await load();
    } catch (e) {
      setMsg(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Admin Dashboard</h1>
        <div className="meta">
          <div>
            <b>Admin Email:</b> {me.email}
          </div>
          <div>
            <b>Admin ID:</b> <span className="pill">{me.id}</span>
          </div>
        </div>
        {msg && <div className="note">{msg}</div>}
      </section>

      <div className="card">
        <h3>Create Course</h3>
        <div className="row">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
          <select
            value={form.facultyId}
            onChange={(e) => setForm({ ...form, facultyId: e.target.value })}
          >
            <option value="">(Optional) Assign Instructor</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.fullName}
              </option>
            ))}
          </select>
          <button onClick={createCourse}>Create</button>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Capacity</th>
                <th>Instructor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.title}</td>
                  <td>{c.capacity}</td>
                  <td>{c?.faculty?.fullName || "-"}</td>
                  <td className="row">
                    <button onClick={() => openEdit(c)}>Edit</button>
                    <button className="danger" onClick={() => askDeleteCourse(c)}>
                      Delete
                    </button>
                    <select
                      defaultValue=""
                      onChange={(e) => assign(c.id, +e.target.value)}
                    >
                      <option value="">Assign Instructor…</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.fullName}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{labelRole(u.role)}</td>
                  <td className="row">
                    <button className="danger" onClick={() => askDeleteUser(u)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">
            Need to create a user? Use the <b>Sign Up</b> page.
          </p>
        </div>
      </div>

      {/*  Edit modal  */}
      {editOpen && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Course</h3>
            <div className="row" style={{ marginTop: 6 }}>
              <input
                placeholder="Title"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
              <input
                placeholder="Code"
                value={editForm.code}
                onChange={(e) =>
                  setEditForm({ ...editForm, code: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Capacity"
                value={editForm.capacity}
                onChange={(e) =>
                  setEditForm({ ...editForm, capacity: e.target.value })
                }
              />
              <select
                value={editForm.facultyId}
                onChange={(e) =>
                  setEditForm({ ...editForm, facultyId: e.target.value })
                }
              >
                <option value="">(Optional) Assign Instructor</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="ghost" onClick={closeEdit}>
                Cancel
              </button>
              <button onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/*  Delete confirm modal  */}
      {confirmOpen && (
        <div className="modal-overlay" onClick={closeConfirm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>
              {confirmData.type === "course" ? "Delete Course" : "Delete User"}
            </h3>
            <p className="muted" style={{ marginTop: 4 }}>
              Are you sure you want to delete{" "}
              <b>{confirmData.label}</b>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="ghost" onClick={closeConfirm}>
                No, keep it
              </button>
              <button className="danger" onClick={confirmDelete}>
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
