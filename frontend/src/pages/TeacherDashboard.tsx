import { useEffect, useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherHeader from "../components/TeacherHeader";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define types for chart data
interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

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

function TeacherDashboard() {
  const [barChartData, setBarChartData] = useState<BarChartData | null>(null);
  const [pieChartData, setPieChartData] = useState<PieChartData | null>(null);
  const [stats, setStats] = useState<Stats>({
    students: 0,
    classes: 0,
    attendanceRate: 0,
  });

  useEffect(() => {
    // Fetch attendance data for the bar chart
    const fetchBarChartData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/attendance/monthly"
        );
        const data = await response.json();
        setBarChartData({
          labels: data.months,
          datasets: [
            {
              label: "Student Attendance",
              data: data.attendance,
              backgroundColor: "#4CAF50",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

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
              backgroundColor: ["#00FF00", "#FF0000", "#FFA500"],
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

    fetchBarChartData();
    fetchPieChartData();
    fetchStats();
  }, []);

  return (
    <>
      <div className="nav">
        <TeacherSidebar />
      </div>
      <TeacherHeader />
      <div className="main">
        {/* Statistics Section */}
        <div className="stats-cards">
          <div className="card">
            <h2>{stats.students}</h2>
            <p>Students</p>
          </div>
          <div className="card">
            <h2>{stats.classes}</h2>
            <p>Classes</p>
          </div>
          <div className="card">
            <h2>{stats.attendanceRate}%</h2>
            <p>Attendance Rate</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <div className="chart-container">
            <h3>Monthly Attendance</h3>
            {barChartData ? <Bar data={barChartData} /> : <p>Loading...</p>}
          </div>
          <div className="chart-container">
            <h3>Total Attendance Overview</h3>
            {pieChartData ? <Pie data={pieChartData} /> : <p>Loading...</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeacherDashboard;
