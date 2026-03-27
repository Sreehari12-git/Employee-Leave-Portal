type LeaveBalanceCardProps = {
  annualTotal: number;
  annualUsed: number;
  sickTotal: number;
  sickUsed: number;
  // remoteTotal: number,
  // remoteUsed: number,
  onRequestTimeOff?: () => void;
};

export default function LeaveBalanceCard({
  annualTotal,
  annualUsed,
  sickTotal,
  sickUsed,
  onRequestTimeOff,
}: LeaveBalanceCardProps) {
  const annualAvailable = annualTotal - annualUsed;
  const sickAvailable = sickTotal - sickUsed;

  const annualPercent = annualTotal > 0 ? (annualAvailable / annualTotal) * 100 : 0;
  const sickPercent = sickTotal > 0 ? (sickAvailable / sickTotal) * 100 : 0;

  return (
    <div style={{
      backgroundColor: "#fff",
      padding: "28px 28px 24px",
      borderRadius: "16px",
      width: "40%",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <h3 style={{
        fontSize: "17px",
        fontWeight: 700,
        color: "#0f172a",
        margin: "0 0 28px",
      }}>
        Leave Balances
      </h3>

      {/* Annual Leave */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>Annual Leave</span>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            <strong style={{ color: "#0f172a", fontWeight: 700 }}>{annualAvailable}</strong>
            {" "}/ {annualTotal} days
          </span>
        </div>
        <div style={{
          width: "100%", height: "6px",
          backgroundColor: "#e2e8f0",
          borderRadius: "999px", overflow: "hidden",
        }}>
          <div style={{
            width: `${annualPercent}%`, height: "100%",
            backgroundColor: "#0f2c5c",
            borderRadius: "999px",
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Sick Leave */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>Sick Leave</span>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            <strong style={{ color: "#0f172a", fontWeight: 700 }}>{sickAvailable}</strong>
            {" "}/ {sickTotal} days
          </span>
        </div>
        <div style={{
          width: "100%", height: "6px",
          backgroundColor: "#e2e8f0",
          borderRadius: "999px", overflow: "hidden",
        }}>
          <div style={{
            width: `${sickPercent}%`, height: "100%",
            backgroundColor: "#334155",
            borderRadius: "999px",
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onRequestTimeOff}
        style={{
          width: "100%", padding: "13px",
          border: "none", borderRadius: "10px",
          backgroundColor: "#f1f5f9",
          color: "#0f172a",
          fontSize: "14px", fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
      >
        Request Time Off
      </button>
    </div>
  );
}