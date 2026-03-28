import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysBetween(start: string, end: string) {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function LeaveApproval() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approvedToday: 0, urgent: 0 });
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${getToken()}` };
    const [leavesRes, countsRes] = await Promise.all([
      fetch(`${API}/leave/all`, { headers }),
      fetch(`${API}/leave/counts`, { headers }),
    ]);
    const leavesData = await leavesRes.json();
    const countsData = await countsRes.json();
    if (Array.isArray(leavesData)) setLeaves(leavesData);
    if (countsData) setCounts(countsData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (leaveId: number) => {
    await fetch(`${API}/leave/update`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, status: "APPROVED" }),
    });
    fetchData(); // ✅ refresh after approve
  };

  const handleReject = async (leaveId: number) => {
    await fetch(`${API}/leave/update`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, status: "REJECTED" }),
    });
    setRejectingId(null);
    setRejectReason("");
    fetchData(); // ✅ refresh after reject
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Approval Queue</h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Review and manage leave requests from your team.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Pending",        value: counts.pending,       iconBg: "#dbeafe", icon: "📋" },
          { label: "Approved Today", value: counts.approvedToday, iconBg: "#dcfce7", icon: "✅" },
          { label: "Urgent Review",  value: counts.urgent ?? 0,   iconBg: "#ffe4e6", icon: "❗" },
        ].map(({ label, value, iconBg, icon }) => (
          <div key={label} style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
              {icon}
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 4px", fontWeight: 500 }}>{label}</p>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                {String(value ?? 0).padStart(2, "0")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Pending Requests</h2>
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>Showing {leaves.length} of {leaves.length}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {leaves.length === 0 && (
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            No pending leave requests
          </div>
        )}

        {leaves.map((leave) => {
          const days = daysBetween(leave.startDate, leave.endDate);
          const isRejecting = rejectingId === leave.id;
          const isUrgent = leave.type === "SICK";

          return (
            <div key={leave.id} style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderLeft: isUrgent ? "4px solid #dc2626" : "4px solid transparent",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr auto auto",
                alignItems: "center",
                padding: "20px 24px",
                gap: "24px",
              }}>
                {/* Employee */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px",
                    backgroundColor: "#e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px", fontWeight: 700, color: "#475569",
                  }}>
                    {leave.user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{leave.user?.username}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{leave.user?.role}</p>
                  </div>
                </div>

                {/* Leave Type */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: isUrgent ? "#dc2626" : "#94a3b8", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                    {isUrgent ? "URGENT: MEDICAL" : "LEAVE TYPE"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: isUrgent ? "#dc2626" : "#3b82f6", display: "inline-block" }} />
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{leave.type}</span>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 4px" }}>DATES</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    {formatDate(leave.startDate)} — {formatDate(leave.endDate)}{" "}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>({days} {days === 1 ? "Day" : "Days"})</span>
                  </p>
                </div>

                {/* ✅ Approve button */}
                <button
                  onClick={() => handleApprove(leave.id)}
                  style={{
                    padding: "10px 20px", borderRadius: "10px", border: "none",
                    backgroundColor: "#14532d", color: "#fff",
                    fontSize: "14px", fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ Approve
                </button>

                {/* ✅ Reject button */}
                <button
                  onClick={() => setRejectingId(isRejecting ? null : leave.id)}
                  style={{
                    width: "32px", height: "32px", borderRadius: "8px", border: "none",
                    backgroundColor: "#fee2e2", color: "#dc2626",
                    fontSize: "16px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Reject panel */}
              {isRejecting && (
                <div style={{ backgroundColor: "#f8fafc", padding: "16px 24px", borderTop: "1px solid #f1f5f9" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 8px" }}>
                    REJECTION REASON (INTERNAL ONLY)
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <input
                      type="text"
                      placeholder="Explain why this request is being declined..."
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      style={{
                        flex: 1, padding: "12px 16px", borderRadius: "10px",
                        border: "1px solid #e2e8f0", fontSize: "14px",
                        outline: "none", color: "#334155",
                      }}
                    />
                    <button
                      onClick={() => handleReject(leave.id)}
                      style={{
                        padding: "12px 24px", borderRadius: "10px", border: "none",
                        backgroundColor: "#dc2626", color: "#fff",
                        fontSize: "14px", fontWeight: 700, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}