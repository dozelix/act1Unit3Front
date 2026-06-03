import { useState } from "react";
import "./index.css";

const CARGOS = [
  "Desarrollador",
  "Diseñador UX/UI",
  "Analista de Datos",
  "Gerente de Proyecto",
  "Soporte Técnico",
];

const BADGE_COLORS = {
  "Desarrollador":      { background: "#dbeafe", color: "#1d4ed8" },
  "Diseñador UX/UI":    { background: "#fce7f3", color: "#be185d" },
  "Analista de Datos":  { background: "#d1fae5", color: "#065f46" },
  "Gerente de Proyecto":{ background: "#ede9fe", color: "#6d28d9" },
  "Soporte Técnico":    { background: "#fef3c7", color: "#92400e" },
};

const initialForm = { nombre: "", apellido: "", cargo: "", correo: "" };

function getInitials(nombre, apellido) {
  return `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
}

export default function RegistroEmpleados() {
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [registros, setRegistros] = useState([]);
  const [editId, setEditId]   = useState(null);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre   = "El nombre es requerido.";
    if (!form.apellido.trim()) e.apellido = "El apellido es requerido.";
    if (!form.cargo)           e.cargo    = "Selecciona un cargo.";
    if (!form.correo.trim()) {
      e.correo = "El correo es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      e.correo = "Correo inválido.";
    }
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (editId !== null) {
      setRegistros((r) => r.map((rec) => rec.id === editId ? { ...form, id: editId } : rec));
      setEditId(null);
      showToast("Registro actualizado.");
    } else {
      setRegistros((r) => [...r, { ...form, id: Date.now() }]);
      showToast("Registro guardado.");
    }
    setForm(initialForm);
    setErrors({});
  };

  const handleEdit = (rec) => {
    setForm({ nombre: rec.nombre, apellido: rec.apellido, cargo: rec.cargo, correo: rec.correo });
    setEditId(rec.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setRegistros((r) => r.filter((rec) => rec.id !== id));
    if (editId === id) { setEditId(null); setForm(initialForm); }
    showToast("Registro eliminado.", "error");
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="registro-root">
      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}

      <div className="registro-container">
        {/* Header */}
        <header className="registro-header">
          <div className="header-accent" />
          <div>
            <p className="header-eyebrow">Sistema de Gestión</p>
            <h1 className="header-title">Formulario de Registro</h1>
          </div>
          {registros.length > 0 && (
            <div className="registro-counter">
              <span className="counter-num">{registros.length}</span>
              <span className="counter-label">
                registro{registros.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </header>

        {/* Form Card */}
        <div className="form-card">
          {editId !== null && (
            <div className="edit-banner">
              <span>✏️ Editando registro</span>
              <button className="btn-ghost" onClick={handleCancel}>Cancelar</button>
            </div>
          )}

          <div className="form-grid">
            <Field label="Nombre" error={errors.nombre}>
              <input
                className={`field-input ${errors.nombre ? "field-input--error" : ""}`}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. María"
              />
            </Field>

            <Field label="Apellido" error={errors.apellido}>
              <input
                className={`field-input ${errors.apellido ? "field-input--error" : ""}`}
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej. González"
              />
            </Field>

            <Field label="Cargo" error={errors.cargo}>
              <select
                className={`field-input ${errors.cargo ? "field-input--error" : ""}`}
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                style={{ color: form.cargo ? "#2a2420" : "#b5afa6" }}
              >
                <option value="">Selecciona un cargo...</option>
                {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Correo Corporativo" error={errors.correo}>
              <input
                className={`field-input ${errors.correo ? "field-input--error" : ""}`}
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="usuario@empresa.cl"
                type="email"
              />
            </Field>
          </div>

          <div className="form-footer">
            <button className="btn-primary" onClick={handleSubmit}>
              {editId !== null ? "💾 Actualizar Registro" : "＋ Guardar Registro"}
            </button>
          </div>
        </div>

        {/* Table / Empty state */}
        {registros.length > 0 ? (
          <div className="table-wrap">
            <table className="registro-table">
              <thead>
                <tr>
                  {["Nombre", "Apellido", "Cargo", "Correo", "Acciones"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registros.map((rec, i) => {
                  const badgeStyle = BADGE_COLORS[rec.cargo] ?? { background: "#f3f4f6", color: "#374151" };
                  return (
                    <tr
                      key={rec.id}
                      style={{ animation: `fadeRow 0.3s ease ${i * 0.04}s both` }}
                    >
                      <td>
                        <div className="td-name">
                          <span className="avatar">{getInitials(rec.nombre, rec.apellido)}</span>
                          {rec.nombre}
                        </div>
                      </td>
                      <td>{rec.apellido}</td>
                      <td>
                        <span className="cargo-badge" style={badgeStyle}>{rec.cargo}</span>
                      </td>
                      <td className="td-email">{rec.correo}</td>
                      <td className="td-actions">
                        <button className="btn-ghost" onClick={() => handleEdit(rec)}>Editar</button>
                        <button className="btn-danger" onClick={() => handleDelete(rec.id)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-text">No hay registros aún. Añade el primero.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
