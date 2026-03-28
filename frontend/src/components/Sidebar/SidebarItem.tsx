type Props = {
  label: string;
  icon: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
};

export const SidebarItem = ({ label, icon, active, onClick }: Props) => {
  return (
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
};