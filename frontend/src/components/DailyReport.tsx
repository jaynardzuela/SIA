import React, { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceRecord {
  id: number;
  studentName: string;
  attendance_date: string;
  status: string;
}

const DailyReport: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance/daily"
        );
        setAttendanceRecords(response.data);
      } catch (error) {
        setError("Failed to fetch attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Daily Attendance Report</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.studentName}</td>
              <td>{record.attendance_date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyReport;
