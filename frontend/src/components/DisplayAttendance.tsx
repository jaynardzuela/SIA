import React, { useState, useEffect } from "react";
import axios from "axios";

interface Attendance {
  id: number;
  student_id: string;
  name: string;
  attendance_date: string;
  status: string;
  photo: string | null;
}

const DisplayAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance"
        );
        setAttendanceRecords(response.data);
      } catch (error: any) {
        console.error("Error fetching attendance:", error);
        if (error.response) {
          setError(
            `Failed to load attendance: ${error.response.status} ${error.response.data}`
          );
        } else if (error.request) {
          setError("Failed to load attendance: No response from server");
        } else {
          setError("Failed to load attendance: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Attendance Records</h2>
      {isLoading ? (
        <p>Loading attendance records...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Student ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Photo</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {record.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.student_id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(record.attendance_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {record.photo ? (
                    <img
                      src={record.photo}
                      alt="Attendance Photo"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No photo"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DisplayAttendance;
