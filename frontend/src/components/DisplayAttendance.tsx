import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Attendance {
  id: number;
  student_id: string;
  name: string;
  timestamp: string;
  photo: string | null;
}

const DisplayAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/attendance');
        setAttendanceRecords(response.data);
      } catch (error: any) {
        console.error('Error fetching attendance:', error);
        if (error.response) {
          setError(`Failed to load attendance: ${error.response.status} ${error.response.data}`);
        } else if (error.request) {
          setError('Failed to load attendance: No response from server');
        } else {
          setError('Failed to load attendance: ' + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <h2>Attendance Records</h2>
      {isLoading ? (
        <p>Loading attendance records...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Timestamp</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.student_id}</td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>
                  {record.photo ? (
                    <img src={record.photo} alt="Attendance Photo" style={{ width: '50px', height: '50px' }} />
                  ) : (
                    'No photo'
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
