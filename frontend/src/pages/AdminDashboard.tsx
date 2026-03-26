import SessionTimer from "../components/SessionTimer";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import { useState } from "react";

export default function AdminDashboard() {
  const username = localStorage.getItem("username");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const [clockStatus, setClockStatus] = useState<"Clocked In" | "Clocked Out">("Clocked Out");

  return (
       <div style={{ padding: "32px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header */}
      <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
        Good morning, {username}
      </h1>
      <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 28px" }}>
        {today} •{" "}
        You are currently{" "}
        <strong style={{ color: clockStatus === "Clocked In" ? "#16a34a" : "#a80000" }}>
          {clockStatus}
        </strong>
      </p>

      <SessionTimer 
      onClockedIn={() => setClockStatus("Clocked In")}
      onClockedOut={() => setClockStatus("Clocked Out")}/>

      <LeaveBalanceCard 
        annualTotal={15}
        annualUsed={0}
        sickTotal={10}
        sickUsed={0}
        />
    </div>
  );
}