import { useState, useEffect } from "react";
import SessionTimer from "../components/SessionTimer";
import LeaveBalanceCard from "../components/LeaveBalanceCard";

const API = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token") || "";

export default function UserDashboard() {
  const username = localStorage.getItem("username");
  const [clockStatus, setClockStatus] = useState<"Clocked In" | "Clocked Out">("Clocked Out");
  const [leaveBalance, setLeaveBalance] = useState({
    annualTotal: 15, annualUsed: 0,
    sickTotal: 10, sickUsed: 0,
    remoteTotal: 10, remoteUsed: 0,
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${getToken()}` };

      // check clock status
      const attRes = await fetch(`${API}/attendance/today`, { headers });
      const attData = await attRes.json();
      if (attData?.attendance?.clockIn && !attData?.attendance?.clockOut) {
        setClockStatus("Clocked In");
      }

      // fetch leave balance
      const leaveRes = await fetch(`${API}/leave/balance`, { headers });
      const leaveData = await leaveRes.json();
      if (leaveData) {
        setLeaveBalance({
          annualTotal: leaveData.annualTotal ?? 15,
          annualUsed: leaveData.annualUsed ?? 0,
          sickTotal: leaveData.sickTotal ?? 10,
          sickUsed: leaveData.sickUsed ?? 0,
          remoteTotal: leaveData.remoteTotal ?? 10,
          remoteUsed: leaveData.remoteUsed ?? 0,
        });
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", backgroundColor: "#f0f2f5", padding: "32px" }}>
        {/* Header */}
        <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
          Good morning, {username}
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 28px" }}>
          {today} •{" "}
          You are currently{" "}
          <strong style={{ color: clockStatus === "Clocked In" ? "#16a34a" : "#a80000" }}>
            {clockStatus}
          </strong>
        </p>

        {/* Session Timer */}
        <div style={{ marginBottom: "20px" }}>
          <SessionTimer
            onClockedIn={() => setClockStatus("Clocked In")}
            onClockedOut={() => setClockStatus("Clocked Out")}
          />
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "20px" }}>
          <LeaveBalanceCard
            annualTotal={leaveBalance.annualTotal}
            annualUsed={leaveBalance.annualUsed}
            sickTotal={leaveBalance.sickTotal}
            sickUsed={leaveBalance.sickUsed}
            remoteTotal={leaveBalance.remoteTotal}
            remoteUsed={leaveBalance.remoteUsed}
          />

          {/* My Attendance Summary */}
          {/* <div style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <p style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>
              My Attendance
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              View your full attendance history in the Attendance tab.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}