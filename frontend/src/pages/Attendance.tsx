import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token") || "";

function formatTime(date: string | null | undefined) {
  if (!date) return "--";
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: string | null | undefined) {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function useTimer(isClockedIn: boolean, clockInTime: string | null) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isClockedIn || !clockInTime) {
      setSeconds(0);
      return;
    }
    const start = new Date(clockInTime).getTime();
    const update = () => setSeconds(Math.floor((Date.now() - start) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const statusStyles: Record<string, { color: string; bg: string }> = {
  "ON TIME":   { color: "#16a34a", bg: "#dcfce7" },
  "LATE IN":   { color: "#92400e", bg: "#fef3c7" },
  "OVERTIME":  { color: "#1d4ed8", bg: "#dbeafe" },
  "UNDERTIME": { color: "#b45309", bg: "#fef9c3" },
  "EXCUSED":   { color: "#dc2626", bg: "#fee2e2" },
  "ABSENT":    { color: "#6b7280", bg: "#f3f4f6" },
};

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || statusStyles["ABSENT"];
  return (
    <span style={{
      padding: "4px 12px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: style.color,
      backgroundColor: style.bg,
    }}>
      {status}
    </span>
  );
}

export default function Attendance() {
  const [today, setToday] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isClockedIn = !!(today?.attendance?.clockIn && !today?.attendance?.clockOut);
  const timer = useTimer(isClockedIn, today?.attendance?.clockIn);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      const [todayRes, recordsRes] = await Promise.all([
        fetch(`${API}/attendance/today`, { headers }),
        fetch(`${API}/attendance/my`, { headers }),
      ]);
      const todayData = await todayRes.json();
      const recordsData = await recordsRes.json();
      setToday(todayData);
      setRecords(recordsData);
    } catch {
      setMessage("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleClockIn = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/attendance/clock-in`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Clocked in successfully!");
      fetchData();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/attendance/clock-out`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Clocked out successfully!");
      fetchData();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // summary stats
  const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);
  const avgHours = records.length ? totalHours / records.length : 0;
  const onTimeCount = records.filter(r => r.status === "ON TIME" || r.status === "OVERTIME").length;
  const onTimeRate = records.length ? Math.round((onTimeCount / records.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "'DM Sans', sans-serif", padding: "32px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
          WORKSPACE / ATTENDANCE LOG
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Monthly Presence</h1>
      </div>

      {/* Stats + Active Session */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: "16px", marginBottom: "32px" }}>
        {/* Total Hours */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Total Hours</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            {totalHours.toFixed(1)} <span style={{ fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}>HRS</span>
          </p>
          <p style={{ fontSize: "12px", color: "#16a34a", margin: 0, fontWeight: 500 }}>↗ This month</p>
        </div>

        {/* Average Day */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Average Day</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            {avgHours.toFixed(1)} <span style={{ fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}>HRS/DAY</span>
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, fontWeight: 500 }}>— Consistent</p>
        </div>

        {/* On-Time Rate */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>On-Time Rate</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
            {onTimeRate} <span style={{ fontSize: "14px", fontWeight: 500, color: "#9ca3af" }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "#16a34a", margin: 0, fontWeight: 500 }}>
            ✓ {onTimeRate >= 90 ? "Excellent" : onTimeRate >= 70 ? "Good" : "Needs Improvement"}
          </p>
        </div>

        {/* Active Session */}
        <div style={{
          background: "linear-gradient(135deg, #0f2c5c 0%, #1e4d8c 100%)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(15,44,92,0.3)",
          color: "#fff",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            Active Session
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 12px" }}>
            {isClockedIn ? "Clocked In" : today?.attendance?.clockOut ? "Clocked Out" : "Not Started"}
          </p>
          {isClockedIn ? (
            <p style={{ fontSize: "28px", fontWeight: 700, fontFamily: "'DM Mono', monospace", margin: "0 0 16px", letterSpacing: "0.05em" }}>
              <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#4ade80", marginRight: "10px", verticalAlign: "middle" }}></span>
              {timer}
            </p>
          ) : (
            <p style={{ fontSize: "14px", color: "#93c5fd", margin: "0 0 16px" }}>
              {today?.attendance?.clockOut
                ? `Duration: ${today?.attendance?.duration || "--"}`
                : "No active session"}
            </p>
          )}

          {/* Clock In / Out Button */}
          {!today?.attendance?.clockIn ? (
            <button onClick={handleClockIn} disabled={actionLoading} style={{
              width: "100%", padding: "10px", borderRadius: "10px", border: "none",
              backgroundColor: "#4ade80", color: "#0f172a", fontWeight: 700,
              fontSize: "14px", cursor: "pointer",
            }}>
              {actionLoading ? "..." : "Clock In"}
            </button>
          ) : !today?.attendance?.clockOut ? (
            <button onClick={handleClockOut} disabled={actionLoading} style={{
              width: "100%", padding: "10px", borderRadius: "10px", border: "none",
              backgroundColor: "#f87171", color: "#fff", fontWeight: 700,
              fontSize: "14px", cursor: "pointer",
            }}>
              {actionLoading ? "..." : "Clock Out"}
            </button>
          ) : (
            <p style={{ fontSize: "13px", color: "#86efac", margin: 0, fontWeight: 500 }}>✓ Session complete</p>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          marginBottom: "16px", padding: "12px 16px", borderRadius: "10px",
          backgroundColor: message.includes("success") ? "#dcfce7" : "#fee2e2",
          color: message.includes("success") ? "#16a34a" : "#dc2626",
          fontSize: "14px", fontWeight: 500,
        }}>
          {message}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        {/* Table Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
          padding: "16px 28px",
          borderBottom: "1px solid #f1f5f9",
        }}>
          {["DATE", "DAY", "CHECK IN", "CHECK OUT", "DURATION", "STATUS"].map(h => (
            <span key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>

        {/* Table Rows */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No attendance records found</div>
        ) : (
          records.map((record, i) => (
            <div key={record.id} style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
              padding: "20px 28px",
              alignItems: "center",
              backgroundColor: i % 2 === 1 ? "#f8fafc" : "#fff",
              borderBottom: "1px solid #f1f5f9",
            }}>
              {/* Date */}
              <span style={{
                fontSize: "15px", fontWeight: 600,
                color: record.status === "ABSENT" ? "#94a3b8" : "#0f172a"
              }}>
                {formatDate(record.date)}
              </span>

              {/* Day */}
              <span style={{
                fontSize: "15px",
                color: record.status === "ABSENT" ? "#94a3b8" : "#64748b"
              }}>
                {record.day || "--"}
              </span>

              {/* Check In */}
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#0f172a" }}>
                {record.leaveType ? (
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em" }}>
                    {record.leaveType} LEAVE
                  </span>
                ) : record.clockIn ? (
                  <>
                    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#0f172a", marginRight: "8px", verticalAlign: "middle" }}></span>
                    {formatTime(record.clockIn)}
                  </>
                ) : "--"}
              </span>

              {/* Check Out */}
              <span style={{ fontSize: "15px", color: "#0f172a" }}>
                {record.clockOut ? formatTime(record.clockOut) : "--"}
              </span>

              {/* Duration */}
              <span>
                {record.duration ? (
                  <span style={{
                    padding: "5px 14px", borderRadius: "999px",
                    backgroundColor: "#dbeafe", color: "#1e40af",
                    fontSize: "13px", fontWeight: 600,
                  }}>
                    {record.duration}
                  </span>
                ) : "--"}
              </span>

              {/* Status */}
              <StatusBadge status={record.status || "ABSENT"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}