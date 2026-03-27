import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard",    icon: "🏠", path: "/user" },
  { label: "Attendance",   icon: "📅", path: "/user/attendance" },
  { label: "Apply Leave",  icon: "📝", path: "/user/apply-leave" },
];

export const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = menuItems.findIndex(item =>
    location.pathname === item.path
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("clockInTime");
    navigate("/login");
  };

  return (
    <div style={{
      width: "240px",
      minHeight: "100vh",
      backgroundColor: "#0f2c5c",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "40px", paddingLeft: "8px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 800, margin: 0 }}>GNAPI HR</h2>
        <p style={{ color: "#93c5fd", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", margin: "4px 0 0" }}>
          EXECUTIVE ATELIER
        </p>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: index === activeIndex ? "rgba(255,255,255,0.15)" : "transparent",
              color: index === activeIndex ? "#fff" : "#93c5fd",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              if (index !== activeIndex) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={e => {
              if (index !== activeIndex) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#93c5fd";
              }
            }}
          >
            <span style={{ fontSize: "16px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "12px 16px",
          backgroundColor: "transparent",
          border: "1px solid rgba(219, 4, 4, 0.38)",
          borderRadius: "10px",
          color: "#93c5fd",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = "rgba(216, 13, 13, 0.08)";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#93c5fd";
        }}
      >
        <span>🚪</span>
        Log out
      </button>
    </div>
  );
};