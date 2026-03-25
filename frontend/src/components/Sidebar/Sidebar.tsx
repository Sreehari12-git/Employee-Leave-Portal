import { SidebarItem } from "./SidebarItem";
import "./sidebar.css"
import { useState } from "react";

const menuItems = [
    { label: "Dashboard", icon:"🏠",active: true},
    { label: "Attendance", icon:"📅" },
    { label: "Leave Requests", icon: "📝" },
    { label: "Team Status", icon: "👥" },
];


export const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <div className="sidebar">
            <div className="logo">
                <h2>GNAPI HR</h2>
                <p>EXECUTIVE ATELIER</p>
            </div>
            <div className="menu">
                {menuItems.map((item,index) => (
                    <SidebarItem
            key={index}
            {...item}
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
                ))}
            </div>
            <div className="button">Clock In</div>
            <div className="extra">
                <p>Settings</p>
                <p>Support</p>
            </div>
        </div>
    )
}