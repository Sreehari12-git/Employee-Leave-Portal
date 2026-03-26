import { useEffect, useRef, useState } from "react";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

function formatTime(totalSeconds: number) {
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// function formatLastPunch(dateStr: string | null) {
//   if (!dateStr) return null;
//   const date = new Date(dateStr);
//   const day = date.toLocaleDateString("en-US", { weekday: "long" });
//   const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
//   return `${day}, ${time}`;
// }

type SessionTimerProps = {
  onClockedIn?: () => void;
  onClockedOut?: () => void;
};

export default function SessionTimer({ onClockedIn, onClockedOut }: SessionTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [lastPunch, setLastPunch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const intervalRef = useRef<number | null>(null);

  // fetch today's status on mount
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await fetch(`${API}/attendance/today`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        const att = data?.attendance;
        if (att?.clockIn && !att?.clockOut) {
          setIsRunning(true);
          setClockInTime(att.clockIn);
          const savedTime = new Date(att.clockIn).getTime();
          setSeconds(Math.floor((Date.now() - savedTime) / 1000));
        }
        if (att?.clockOut) {
          setLastPunch(att.clockOut);
        } else if (att?.clockIn) {
          setLastPunch(att.clockIn);
        }
      } catch {}
    };
    fetchToday();
  }, []);

  // timer tick
  useEffect(() => {
    if (isRunning && clockInTime) {
      const start = new Date(clockInTime).getTime();
      intervalRef.current = window.setInterval(() => {
        setSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  }, [isRunning, clockInTime]);

  const handleClockIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/attendance/clock-in`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const now = new Date().toISOString();
      setClockInTime(now);
      localStorage.setItem("clockInTime", now);
      setIsRunning(true);
      setLastPunch(now);
      onClockedIn?.();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API}/attendance/clock-out`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsRunning(false);
      setSeconds(0);
      setClockInTime(null);
      localStorage.removeItem("clockInTime");
      setLastPunch(new Date().toISOString());
      onClockedOut?.();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "16px",
      backgroundColor: "#fff",
      padding: "28px",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      fontFamily: "'DM Sans', sans-serif",
      alignItems: "stretch",
    }}>
      {/* Left - Timer */}
      <div>
        <div style={{
          display: "inline-block",
          backgroundColor: "#f1f5f9",
          padding: "6px 14px",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: 700,
          color: "#475569",
          letterSpacing: "0.08em",
          marginBottom: "16px",
        }}>
          CURRENT SESSION
        </div>

        <h1 style={{
          fontSize: "56px",
          margin: "0 0 24px",
          color: "#0f2c5c",
          fontWeight: 800,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "-0.02em",
        }}>
          {formatTime(seconds)}
        </h1>

        {message && (
          <p style={{ fontSize: "13px", color: "#dc2626", margin: "0 0 12px", fontWeight: 500 }}>{message}</p>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          {/* Clock In */}
          <button
            onClick={handleClockIn}
            disabled={isRunning || loading}
            style={{
              flex: 1, padding: "14px 20px",
              fontSize: "15px", fontWeight: 700,
              border: "none", borderRadius: "10px",
              backgroundColor: isRunning ? "#bbf7d0" : "#14532d",
              color: isRunning ? "#16a34a" : "#fff",
              cursor: isRunning ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <span style={{
              width: "0", height: "0",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: `10px solid ${isRunning ? "#16a34a" : "#fff"}`,
            }} />
            Clock In
          </button>

          {/* Clock Out */}
          <button
            onClick={handleClockOut}
            disabled={!isRunning || loading}
            style={{
              flex: 1, padding: "14px 20px",
              fontSize: "15px", fontWeight: 700,
              border: "none", borderRadius: "10px",
              backgroundColor: !isRunning ? "#fee2e2" : "#fca5a5",
              color: !isRunning ? "#fca5a5" : "#7f1d1d",
              cursor: !isRunning ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s",
            }}
          >
            <span style={{
              width: "10px", height: "10px",
              backgroundColor: !isRunning ? "#fca5a5" : "#7f1d1d",
              borderRadius: "2px",
            }} />
            Clock Out
          </button>
        </div>
      </div>


    </div>
  );
}