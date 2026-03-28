import { SidebarItem } from "./SidebarItem";
import "./sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard",      icon: "🏠", path: "/admin/dashboard" },
  { label: "Attendance",     icon: "📅", path: "/admin/attendance" },
  { label: "Add Employee",   icon: "👔", path: "/admin/add-employee" },
  { label: "Leave Requests", icon: "📝", path: "/admin/leaves" },
  { label: "Team Status",    icon: "👥", path: "/admin/team" },
];

export const Sidebar = () => {
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
    <div className="sidebar">
      <div className="logo">
        <h2>GNAPI HR</h2>
        <p>EXECUTIVE ATELIER</p>
      </div>
      <div className="menu">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            {...item}
            active={index === activeIndex}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
      <div className="logout">
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            border: "1px solid rgba(219, 4, 4, 0.38)",
            borderRadius: "10px",
            color: "#054bad",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "rgba(216, 13, 13, 0.08)";
            e.currentTarget.style.color = "#0a19ee";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#054bad";
          }}
        >
          <span style={{ fontSize: "16px" }}>🚪</span>
          Log out
        </button>
      </div>
    </div>
  );
};