import "./styles/App.css";
import { Route, Routes } from "react-router-dom";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentList from "./pages/StudentList";
import StudentAttendance from "./pages/StudentAttendance";
import StudentReport from "./pages/StudentReport";
import AttendancePage from "./pages/AttendancePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAccounts from "./pages/AdminAccounts";
import AdminAttendance from "./pages/AdminAttendance";
import GuardDashboard from "./pages/GuardDashboard";
import GuardAttendance from "./pages/GuardAttendance";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="/studentattendance" element={<StudentAttendance />} />
        <Route path="/studentreport" element={<StudentReport />} />
        <Route path="/attendancepage" element={<AttendancePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-accounts" element={<AdminAccounts />} />
        <Route path="/admin-attendance" element={<AdminAttendance />} />
        <Route path="/guard-dashboard" element={<GuardDashboard />} />
        <Route path="/guard-attendance" element={<GuardAttendance />} />
      </Routes>
    </>
  );
}

export default App;
