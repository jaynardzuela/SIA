"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "../components/ui/chart";
import TeacherSidebar from "@/components/TeacherSidebar";
import TeacherHeader from "@/components/TeacherHeader";
import MonthlyReport from "@/components/MonthlyReport";

// Register Chart.js components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

// Define types for chart data
interface PieChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
  }[];
}

interface Stats {
  students: number;
  classes: number;
  attendanceRate: number;
}

export default function TeacherDashboard() {
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null);
  const [stats, setStats] = useState<Stats>({
    students: 0,
    classes: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    // Fetch attendance overview data for the pie chart
    const fetchPieChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/attendance/overview"
        );
        const data = await response.json();
        setPieChartData({
          labels: ["Present", "Absent", "Late"],
          datasets: [
            {
              data: data.attendanceBreakdown,
              backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    // Fetch overall statistics
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stats");
        const data = await response.json();
        setStats({
          students: data.totalStudents,
          classes: data.totalClasses,
          attendanceRate: data.attendanceRate,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchPieChartData();
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherHeader />
        <main className="main">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Dashboard
            </h1>
            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.students}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.classes}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.attendanceRate}%
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <MonthlyReport />
              <Card>
                <CardHeader>
                  <CardTitle>Total Attendance Overview</CardTitle>
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
        </main>
      </div>
    </div>
  );
}
