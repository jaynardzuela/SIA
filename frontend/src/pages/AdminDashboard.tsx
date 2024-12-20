import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import WeeklyReport from "@/components/WeeklyReport";
import MonthlyReport from "@/components/MonthlyReport";
import YearlyReport from "@/components/YearlyReport";
import { Pie } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "../components/ui/chart";

const AdminDashboard: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalProfessors, setTotalProfessors] = useState<number>(0);
  const [attendanceRate, setAttendanceRate] = useState<number>(0);
  const [pieChartData, setPieChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get(
          "http://localhost:5000/api/students"
        );
        const professorsResponse = await axios.get(
          "http://localhost:5000/api/professors"
        );
        const attendanceResponse = await axios.get(
          "http://localhost:5000/api/attendance"
        );

        setTotalStudents(studentsResponse.data.length);
        setTotalProfessors(professorsResponse.data.count);

        const totalAttendance = attendanceResponse.data.length;
        const presentAttendance = attendanceResponse.data.filter(
          (record: any) => record.status === "PRESENT"
        ).length;
        const rate = (presentAttendance / totalAttendance) * 100;
        setAttendanceRate(rate);

        // Prepare pie chart data
        const pieData = {
          labels: ["Present", "Absent"],
          datasets: [
            {
              data: [presentAttendance, totalAttendance - presentAttendance],
              backgroundColor: ["#4caf50", "#f44336"],
            },
          ],
        };
        setPieChartData(pieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="nav">
        <AdminSidebar />
      </div>
      <AdminHeader />
      <div className="main container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Total Students</h2>
            <p className="text-3xl">{totalStudents}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Total Professors</h2>
            <p className="text-3xl">{totalProfessors}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Attendance Rate</h2>
            <p className="text-3xl">{attendanceRate.toFixed(2)}%</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyReport />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyReport />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yearly Report</CardTitle>
            </CardHeader>
            <CardContent>
              <YearlyReport />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer className="h-[300px]">
                {pieChartData ? (
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
