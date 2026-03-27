import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

const statusColors: Record<string, { color: string; bg: string }> = {
  "PENDING":  { color: "#92400e", bg: "#fef3c7" },
  "APPROVED": { color: "#16a34a", bg: "#dcfce7" },
  "REJECTED": { color: "#dc2626", bg: "#fee2e2" },
};

export default function ApplyLeave() {
  const [formData, setFormData] = useState({ type: "ANNUAL", startDate: "", endDate: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState<any[]>([]); // ✅ leave history

  const fetchMyLeaves = async () => {
    const res = await fetch(`${API}/leave/my`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setMyLeaves(data);
  };

  useEffect(() => { fetchMyLeaves(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const daysBetween = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    return Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/leave/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Leave request submitted successfully!");
      setFormData({ type: "ANNUAL", startDate: "", endDate: "" });
      fetchMyLeaves(); // ✅ refresh history after submit
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const days = daysBetween();

  return (
    <div style={{ padding: "32px", backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Apply for Leave</h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Submit a leave request for approval by your manager.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "900px" }}>
        {/* Form */}
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0 0 24px" }}>Leave Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "8px" }}>Leave Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", outline: "none" }}>
                <option value="ANNUAL">Annual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="REMOTE">Work from Home</option>
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "8px" }}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569", display: "block", marginBottom: "8px" }}>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} min={formData.startDate || new Date().toISOString().split("T")[0]} required style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box" }} />
            </div>
            {message && <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#dcfce7", color: "#16a34a", fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>✓ {message}</div>}
            {error && <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#fee2e2", color: "#dc2626", fontSize: "14px", fontWeight: 500, marginBottom: "16px" }}>✕ {error}</div>}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: "#0f2c5c", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0 0 20px" }}>Request Summary</h3>
            {[
              { label: "Leave Type", value: formData.type === "ANNUAL" ? "Annual Leave" : formData.type === "SICK" ? "Sick Leave" : "Work from Home" },
              { label: "Start Date",  value: formData.startDate ? new Date(formData.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "--" },
              { label: "End Date",    value: formData.endDate ? new Date(formData.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "--" },
              { label: "Total Days",  value: days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : "--" },
              { label: "Status",      value: "Pending Approval" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: label === "Status" ? "#f59e0b" : "#0f172a" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "20px", border: "1px solid #bfdbfe" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1d4ed8", margin: "0 0 8px" }}>ℹ️ How it works</p>
            <p style={{ fontSize: "13px", color: "#3b82f6", margin: 0, lineHeight: "1.6" }}>Your request will be reviewed by the admin. You'll see the status update in your leave history below once it's approved or rejected.</p>
          </div> */}
        </div>
      </div>

      {/* ✅ My Leave History */}
      <div style={{ maxWidth: "900px", marginTop: "32px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>My Leave History</h2>
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid #f1f5f9" }}>
            {["TYPE", "START DATE", "END DATE", "STATUS"].map(h => (
              <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>{h}</span>
            ))}
          </div>

          {myLeaves.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>No leave requests yet</div>
          ) : (
            myLeaves.map((leave, i) => {
              const s = statusColors[leave.status] || statusColors["PENDING"];
              return (
                <div key={leave.id} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  padding: "16px 24px", alignItems: "center",
                  backgroundColor: i % 2 === 1 ? "#f8fafc" : "#fff",
                  borderBottom: "1px solid #f1f5f9",
                }}>
<span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
  {leave.type === "ANNUAL" ? "Annual Leave" : leave.type === "SICK" ? "Sick Leave" : leave.type === "REMOTE" ? "Work from Home" : leave.type}
</span>                  <span style={{ fontSize: "14px", color: "#64748b" }}>
                    {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>
                    {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {/* ✅ status badge */}
                  <span style={{
                    display: "inline-block", padding: "4px 12px",
                    borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                    color: s.color, backgroundColor: s.bg,
                    width: "fit-content",
                  }}>
                    {leave.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}