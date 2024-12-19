import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, FileText, LogOut } from "lucide-react";
import { useState } from "react";
import "../styles/sidebar.css";

function TeacherSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: "/teacher-dashboard", label: "Dashboard", icon: Home },
    { path: "/studentlist", label: "Students", icon: Users },
    { path: "/studentattendance", label: "Attendance", icon: Calendar },
    { path: "/studentreport", label: "Report", icon: FileText },
  ];

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to the login page
    navigate("/login");
  };

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
        <button
          className="logout-button"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">
              Confirm Logout
            </h2>
            <p className="mb-4 text-black">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default TeacherSidebar;
