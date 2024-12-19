import "../styles/AttendanceTable.css";

function AttendanceTable() {
  // This is dummy data. In a real application, you'd fetch this from your backend.
  const attendanceLogs = [
    { id: 1, date: "2023-06-01", present: 25, absent: 5, total: 30 },
    { id: 2, date: "2023-06-02", present: 28, absent: 2, total: 30 },
    { id: 3, date: "2023-06-03", present: 27, absent: 3, total: 30 },
  ];

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {attendanceLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.date}</td>
              <td>{log.present}</td>
              <td>{log.absent}</td>
              <td>{log.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
