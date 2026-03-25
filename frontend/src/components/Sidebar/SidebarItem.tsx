import { Link } from "react-router-dom";

type Props = {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
};

export const SidebarItem = ({ label, icon, active, onClick }: Props) => {
    const path = label === "Dashboard"? "/":`/${label.toLowerCase().replace(" ","")}`;
  return (
    <Link to={path} style={{textDecoration: "none", color: "black"}}>
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span>{label}</span>
    </div>
    </Link>
  );
};