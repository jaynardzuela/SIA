"use client";

import { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherHeader from "../components/TeacherHeader";
import WeeklyReport from "../components/WeeklyReport";
import MonthlyReport from "../components/MonthlyReport";
import YearlyReport from "../components/YearlyReport";

function StudentReport() {
  const [reportType, setReportType] = useState("daily");

  const renderReport = () => {
    switch (reportType) {
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
    <div className="flex h-screen bg-gray-100">
      <div className="flex-none">
        <TeacherSidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherHeader />
        <main className="main">
          <div className="container">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Student Report
            </h1>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setReportType("weekly")}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    reportType === "weekly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setReportType("monthly")}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    reportType === "monthly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setReportType("yearly")}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    reportType === "yearly"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Yearly
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">{renderReport()}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentReport;
