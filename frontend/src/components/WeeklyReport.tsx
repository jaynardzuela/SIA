import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type AttendanceEntry = {
  student_id: string;
  name: string;
  section: string;
  attendance_date: string;
  status: string;
};

function WeeklyReport() {
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<AttendanceEntry[]>("http://localhost:5000/api/attendance/weekly")
      .then((response) => {
        setAttendanceData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weekly attendance data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (attendanceData.length === 0) {
    return <p>No attendance data available for this week.</p>;
  }

  const chartData = attendanceData.reduce((acc, entry) => {
    const date = entry.attendance_date;
    const existingEntry = acc.find((item) => item.date === date);

    if (existingEntry) {
      existingEntry.present += entry.status === "PRESENT" ? 1 : 0;
      existingEntry.absent += entry.status === "ABSENT" ? 1 : 0;
    } else {
      acc.push({
        date,
        present: entry.status === "PRESENT" ? 1 : 0,
        absent: entry.status === "ABSENT" ? 1 : 0,
      });
    }

    return acc;
  }, [] as { date: string; present: number; absent: number }[]);

  console.log("Processed Chart Data:", chartData);

  return (
    <div className="weekly-report">
      <h2>Weekly Attendance Report</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#82ca9d" name="Present" />
          <Bar dataKey="absent" fill="#ff4d4d" name="Absent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyReport;
