import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentList from "./pages/StudentList";
import StudentAttendance from "./pages/StudentAttendance";
import StudentReport from "./pages/StudentReport";
import AttendancePage from "./pages/AttendancePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="/studentattendance" element={<StudentAttendance />} />
        <Route path="/studentreport" element={<StudentReport />} />
        <Route path="/attendancepage" element={<AttendancePage />} />
      </Routes>
    </>
  );
}

export default App;
