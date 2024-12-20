import { useEffect, useState } from "react";
import professorPhoto from "../images/placeholder/placeholder.png";

function AdminHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the email from local storage
    const email = localStorage.getItem("email");
    setUserEmail(email);
  }, []);

  return (
    <div className="header">
      <div className="title">QCU-AMS</div>
      <div className="profile">
        <img
          src={professorPhoto}
          alt="Professor Profile"
          className="profile-image"
        />
        <span className="profile-name">{userEmail}</span>
      </div>
    </div>
  );
}

export default AdminHeader;
