import TeacherSidebar from "../components/TeacherSidebar";
import "../styles/sidebar.css";
import TeacherHeader from "../components/TeacherHeader";
import AttendanceSystemWithCameraScanner from "@/components/AttendanceSystemWithCameraScanner";
import "../styles/App.css";
function StudentReport() {
  return (
    <>
      <div className="nav">
        <TeacherSidebar />
      </div>
      <TeacherHeader />
      <div className="main">
        <AttendanceSystemWithCameraScanner />
      </div>
    </>
  );
}

export default StudentReport;
