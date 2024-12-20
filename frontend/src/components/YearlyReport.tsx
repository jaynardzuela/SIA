import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface YearlyAttendanceData {
  year: number;
  attendance_count: number;
  present_count: number;
  absent_count: number;
}

const YearlyReport: React.FC = () => {
  const [yearlyData, setYearlyData] = useState<YearlyAttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance/yearly"
        );
        setYearlyData(response.data);
      } catch (err) {
        setError("Failed to fetch yearly attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: yearlyData.map((data) => data.year.toString()), // Years as labels
    datasets: [
      {
        label: "Total Attendances",
        data: yearlyData.map((data) => data.attendance_count),
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Light teal
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Present",
        data: yearlyData.map((data) => data.present_count),
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Light blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Absent",
        data: yearlyData.map((data) => data.absent_count),
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Light red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Yearly Attendance Report",
      },
    },
  };

  return (
    <div>
      <h2>Yearly Attendance Report</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default YearlyReport;
