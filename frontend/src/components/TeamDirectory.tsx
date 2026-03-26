import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

const statusStyles: Record<string, { color: string; bg: string; label: string }> = {
  "PRESENT":   { color: "#16a34a", bg: "#dcfce7", label: "PRESENT" },
  "ON LEAVE":  { color: "#dc2626", bg: "#fee2e2", label: "ON LEAVE" },
  "OUT OFFICE":{ color: "#6b7280", bg: "#f3f4f6", label: "OUT OFFICE" },
};

export default function TeamDirectory() {
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/attendance/team`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => res.json())
      .then(setTeam);
  }, []);

  return (
    <div style={{ padding: "32px", backgroundColor: "#f0f2f5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Member Directory</h2>
        {/* Legend */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {[
            { color: "#16a34a", label: "Present" },
            { color: "#6b7280", label: "Out of Office" },
            { color: "#dc2626", label: "On Leave" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {team.map((member, i) => {
          const style = statusStyles[member.presenceStatus] || statusStyles["OUT OFFICE"];
          return (
            <div key={member.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              alignItems: "center",
              padding: "20px 28px",
              borderBottom: i < team.length - 1 ? "1px solid #f1f5f9" : "none",
              gap: "40px",
            }}>
              {/* Name + Role */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Avatar with status dot */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: "#e2e8f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px", fontWeight: 700, color: "#475569",
                  }}>
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  {member.presenceStatus === "PRESENT" && (
                    <span style={{
                      position: "absolute", bottom: "2px", right: "2px",
                      width: "10px", height: "10px", borderRadius: "50%",
                      backgroundColor: "#16a34a", border: "2px solid #fff",
                    }} />
                  )}
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{member.username}</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{member.role}</p>
                </div>
              </div>

              {/* Status */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 6px" }}>STATUS</p>
                <span style={{
                  padding: "4px 12px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: 700,
                  color: style.color, backgroundColor: style.bg,
                }}>
                  {style.label}
                </span>
              </div>

              {/* Clock In time */}
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", margin: "0 0 6px" }}>CLOCK IN</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#334155", margin: 0 }}>
                  {member.clockIn
                    ? new Date(member.clockIn).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                    : "--"}
                </p>
              </div>

              {/* View Activity */}
              <div>
                {member.presenceStatus === "PRESENT" ? (
                  <button style={{
                    fontSize: "13px", fontWeight: 700, color: "#0f2c5c",
                    background: "none", border: "none", cursor: "pointer",
                  }}>
                    View Activity
                  </button>
                ) : member.presenceStatus === "ON LEAVE" ? (
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>On Leave</span>
                ) : (
                  <span style={{ fontSize: "13px", color: "#94a3b8" }}>--</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {/* <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button style={{
          fontSize: "14px", fontWeight: 700, color: "#0f172a",
          background: "none", border: "none", cursor: "pointer",
        }}>
          Load More Team Members
        </button>
      </div> */}
    </div>
  );
}