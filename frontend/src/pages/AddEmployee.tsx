import { useState } from "react";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add employee");

      setMessage({ text: "Employee added successfully!", success: true });
      setFormData({ name: "", email: "", password: "", role: "" });
    } catch (error: any) {
      setMessage({ text: error.message, success: false });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name",       name: "name",     type: "text",     placeholder: "e.g. John Smith" },
    { label: "Email Address",   name: "email",    type: "email",    placeholder: "e.g. john@company.com" },
    { label: "Password",        name: "password", type: "password", placeholder: "Min. 8 characters" },
    { label: "Job Role / Title",name: "role",     type: "text",     placeholder: "e.g. GIS Intern" },
  ];

  return (
    <div style={{
      padding: "32px",
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{
          fontSize: "12px", color: "#9ca3af", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px",
        }}>
          WORKSPACE / ADD EMPLOYEE
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
          New Employee
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>

        {/* Form Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>
            Employee Details
          </h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 32px" }}>
            Fill in the information below to create a new employee account.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {fields.map(({ label, name, type, placeholder }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    fontSize: "12px", fontWeight: 700,
                    color: "#64748b", letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      fontSize: "14px",
                      color: "#0f172a",
                      backgroundColor: "#f8fafc",
                      outline: "none",
                      transition: "border 0.2s",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={e => e.currentTarget.style.border = "1px solid #0f2c5c"}
                    onBlur={e => e.currentTarget.style.border = "1px solid #e2e8f0"}
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            {message && (
              <div style={{
                marginTop: "24px",
                padding: "14px 18px",
                borderRadius: "10px",
                backgroundColor: message.success ? "#dcfce7" : "#fee2e2",
                color: message.success ? "#16a34a" : "#dc2626",
                fontSize: "14px",
                fontWeight: 600,
              }}>
                {message.success ? "✓ " : "✕ "}{message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "28px",
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#94a3b8" : "#0f2c5c",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#1e4d8c"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#0f2c5c"; }}
            >
              {loading ? "Creating Account..." : "Add Employee"}
            </button>
          </form>
        </div>

        {/* Side Info Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Tips card
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>
              Quick Guide
            </h3>
            {[
              { icon: "👤", title: "Full Name",    desc: "Use their legal name as it appears on documents." },
              { icon: "📧", title: "Email",        desc: "This will be their login username." },
              { icon: "🔒", title: "Password",     desc: "Temporary — employee should change on first login." },
              { icon: "💼", title: "Role / Title", desc: "Their job title e.g. GIS Intern, UI Developer." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: "14px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  backgroundColor: "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#334155", margin: "0 0 2px" }}>{title}</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div> */}

          {/* Role examples card
          <div style={{
            background: "linear-gradient(135deg, #0f2c5c 0%, #1e4d8c 100%)",
            borderRadius: "20px",
            padding: "28px",
            boxShadow: "0 4px 20px rgba(15,44,92,0.3)",
            color: "#fff",
          }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 14px", color: "#fff" }}>
              Common Roles
            </h3>
            {["GIS Intern", "Full Stack Trainee", "UI Developer", "HR Manager", "Data Analyst"].map(role => (
              <div key={role} style={{
                padding: "8px 14px", marginBottom: "8px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "13px", fontWeight: 500, color: "#e2e8f0",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
                onClick={() => setFormData(f => ({ ...f, role }))}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
              >
                + {role}
              </div>
            ))}
            <p style={{ fontSize: "11px", color: "#93c5fd", margin: "12px 0 0", fontWeight: 500 }}>
              Click any role to auto-fill
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}