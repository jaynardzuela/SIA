import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, FileText, LogOut } from "lucide-react";
import "../styles/sidebar.css";

function TeacherSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/studentlist", label: "Students", icon: Users },
    { path: "/studentattendance", label: "Attendance", icon: Calendar },
    { path: "/studentreport", label: "Report", icon: FileText },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">Teacher Portal</div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default TeacherSidebar;
