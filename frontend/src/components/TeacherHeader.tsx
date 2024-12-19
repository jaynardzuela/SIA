import professorPhoto from "../images/placeholder/placeholder.png";

function TeacherHeader() {
  return (
    <div className="header">
      <div className="title">QCU-AMS</div>
      <div className="profile">
        <img
          src={professorPhoto}
          alt="Professor Profile"
          className="profile-image"
        />
        <span className="profile-name">Professor Name</span>
      </div>
    </div>
  );
}

export default TeacherHeader;
