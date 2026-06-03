import { useState } from "react";

const CARGOS = [
  "Desarrollador",
  "Diseñador UX/UI",
  "Analista de Datos",
  "Gerente de Proyecto",
  "Soporte Técnico",
];

const initialForm = { nombre: "", apellido: "", cargo: "", correo: "" };

function getInitials(nombre, apellido) {
  return `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
}

const BADGE_COLORS = {
  "Desarrollador": { bg: "#dbeafe", color: "#1d4ed8" },
  "Diseñador UX/UI": { bg: "#fce7f3", color: "#be185d" },
  "Analista de Datos": { bg: "#d1fae5", color: "#065f46" },
  "Gerente de Proyecto": { bg: "#ede9fe", color: "#6d28d9" },
  "Soporte Técnico": { bg: "#fef3c7", color: "#92400e" },
};

export default function RegistroEmpleados() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [registros, setRegistros] = useState([]);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido.";
    if (!form.apellido.trim()) e.apellido = "El apellido es requerido.";
    if (!form.cargo) e.cargo = "Selecciona un cargo.";
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
    <div style={styles.root}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede8; }
        input, select { font-family: 'DM Sans', sans-serif; }
        input:focus, select:focus { outline: none; }
        ::placeholder { color: #b5afa6; }

        .field-group input, .field-group select {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-group input:focus, .field-group select:focus {
          border-color: #2a2420 !important;
          box-shadow: 0 0 0 3px rgba(42,36,32,0.10);
        }
        .btn-primary {
          background: #2a2420;
          color: #f0ede8;
          border: none;
          border-radius: 10px;
          padding: 13px 28px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: background 0.18s, transform 0.13s;
        }
        .btn-primary:hover { background: #3d3530; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent;
          border: 1.5px solid #ccc8c2;
          color: #7a746d;
          border-radius: 8px;
          padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-ghost:hover { border-color: #2a2420; color: #2a2420; }
        .btn-danger {
          background: transparent;
          border: 1.5px solid #f0c8c8;
          color: #c0392b;
          border-radius: 8px;
          padding: 7px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-danger:hover { background: #fef0ef; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRow {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          padding: 13px 22px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          animation: slideIn 0.25s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.13);
        }
        .toast.success { background: #2a2420; color: #f0ede8; }
        .toast.error { background: #c0392b; color: #fff; }
      `}</style>

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerAccent} />
          <div>
            <p style={styles.eyebrow}>Sistema de Gestión</p>
            <h1 style={styles.title}>Formulario de Registro</h1>
          </div>
          {registros.length > 0 && (
            <div style={styles.counter}>
              <span style={styles.counterNum}>{registros.length}</span>
              <span style={styles.counterLabel}>registro{registros.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </header>

        {/* Form Card */}
        <div style={styles.card}>
          {editId !== null && (
            <div style={styles.editBanner}>
              <span>✏️ Editando registro</span>
              <button className="btn-ghost" onClick={handleCancel}>Cancelar</button>
            </div>
          )}

          <div style={styles.grid}>
            <Field label="Nombre" error={errors.nombre}>
              <input
                style={{ ...styles.input, ...(errors.nombre ? styles.inputError : {}) }}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. María"
                className="field-group"
              />
            </Field>

            <Field label="Apellido" error={errors.apellido}>
              <input
                style={{ ...styles.input, ...(errors.apellido ? styles.inputError : {}) }}
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej. González"
                className="field-group"
              />
            </Field>

            <Field label="Cargo" error={errors.cargo}>
              <select
                style={{ ...styles.input, ...(errors.cargo ? styles.inputError : {}), color: form.cargo ? "#2a2420" : "#b5afa6" }}
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
                className="field-group"
              >
                <option value="">Selecciona un cargo...</option>
                {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Correo Corporativo" error={errors.correo}>
              <input
                style={{ ...styles.input, ...(errors.correo ? styles.inputError : {}) }}
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="usuario@empresa.com"
                type="email"
                className="field-group"
              />
            </Field>
          </div>

          <div style={styles.formFooter}>
            <button className="btn-primary" onClick={handleSubmit}>
              {editId !== null ? "💾 Actualizar Registro" : "＋ Guardar Registro"}
            </button>
          </div>
        </div>

        {/* Table */}
        {registros.length > 0 ? (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Nombre", "Apellido", "Cargo", "Correo", "Acciones"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registros.map((rec, i) => {
                  const badge = BADGE_COLORS[rec.cargo] ?? { bg: "#f3f4f6", color: "#374151" };
                  return (
                    <tr key={rec.id} style={{ animation: `fadeRow 0.3s ease ${i * 0.04}s both` }}>
                      <td style={styles.tdName}>
                        <span style={styles.avatar}>{getInitials(rec.nombre, rec.apellido)}</span>
                        {rec.nombre}
                      </td>
                      <td style={styles.td}>{rec.apellido}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: badge.bg, color: badge.color }}>
                          {rec.cargo}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#7a746d", fontSize: 13 }}>{rec.correo}</td>
                      <td style={{ ...styles.td, whiteSpace: "nowrap" }}>
                        <button className="btn-ghost" onClick={() => handleEdit(rec)} style={{ marginRight: 6 }}>
                          Editar
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(rec.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <p style={styles.emptyText}>No hay registros aún. Añade el primero.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="field-group" style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f0ede8",
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 20px 80px",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 32,
    position: "relative",
  },
  headerAccent: {
    width: 5,
    height: 52,
    background: "#2a2420",
    borderRadius: 4,
    flexShrink: 0,
  },
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    color: "#9e9890",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: "#2a2420",
    letterSpacing: "-0.02em",
  },
  counter: {
    marginLeft: "auto",
    textAlign: "center",
    background: "#2a2420",
    borderRadius: 12,
    padding: "10px 20px",
  },
  counterNum: {
    display: "block",
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: "#f0ede8",
    lineHeight: 1,
  },
  counterLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: "#9e9890",
    letterSpacing: "0.08em",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: "32px 36px 28px",
    boxShadow: "0 2px 16px rgba(42,36,32,0.07)",
    marginBottom: 28,
  },
  editBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fef9ec",
    border: "1.5px solid #f5d87a",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 24,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    color: "#8a6d00",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 28px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#7a746d",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e5e2dc",
    borderRadius: 10,
    fontSize: 14,
    color: "#2a2420",
    background: "#faf9f7",
    appearance: "none",
  },
  inputError: {
    borderColor: "#e74c3c",
    background: "#fff8f8",
  },
  errorMsg: {
    fontSize: 12,
    color: "#c0392b",
    marginTop: 2,
  },
  formFooter: {
    marginTop: 28,
    display: "flex",
    justifyContent: "flex-end",
  },
  tableWrap: {
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(42,36,32,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    background: "#f7f5f2",
    padding: "14px 18px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "#9e9890",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    borderBottom: "1.5px solid #e5e2dc",
    fontFamily: "'Syne', sans-serif",
  },
  td: {
    padding: "14px 18px",
    borderBottom: "1px solid #f0ede8",
    color: "#2a2420",
    verticalAlign: "middle",
  },
  tdName: {
    padding: "14px 18px",
    borderBottom: "1px solid #f0ede8",
    color: "#2a2420",
    verticalAlign: "middle",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 500,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#2a2420",
    color: "#f0ede8",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    flexShrink: 0,
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },
  empty: {
    background: "#fff",
    borderRadius: 18,
    padding: "60px 20px",
    textAlign: "center",
    boxShadow: "0 2px 16px rgba(42,36,32,0.07)",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: "#9e9890",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
  },
};
