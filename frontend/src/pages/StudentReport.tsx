import { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import "../styles/sidebar.css";
import TeacherHeader from "../components/TeacherHeader";
import "../styles/App.css";
import DailyReport from "../components/DailyReport";
import WeeklyReport from "../components/WeeklyReport";
import MonthlyReport from "../components/MonthlyReport";
import YearlyReport from "../components/YearlyReport";

function StudentReport() {
  const [reportType, setReportType] = useState("daily");

  const renderReport = () => {
    switch (reportType) {
      case "daily":
        return <DailyReport />;
      case "weekly":
        return <WeeklyReport />;
      case "monthly":
        return <MonthlyReport />;
      case "yearly":
        return <YearlyReport />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="nav">
        <TeacherSidebar />
      </div>
      <TeacherHeader />
      <div className="main">
        <div className="report-buttons">
          <button onClick={() => setReportType("daily")}>Daily</button>
          <button onClick={() => setReportType("weekly")}>Weekly</button>
          <button onClick={() => setReportType("monthly")}>Monthly</button>
          <button onClick={() => setReportType("yearly")}>Yearly</button>
        </div>
        <div className="report-content">{renderReport()}</div>
      </div>
    </>
  );
}

export default StudentReport;
