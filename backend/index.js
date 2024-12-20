import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createPool } from 'mysql2/promise';
import { format } from 'date-fns-tz';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';
const app = express();
const port = 5000;



app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Configure MySQL connection
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sia',
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];

    // Compare the provided password with the stored password
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ success: true, data: { userId: user.id, role: user.role } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});


  app.get('/api/students', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT id, name, student_id, section, email, phone, address, photo, classification FROM students');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).send('Failed to fetch students.');
    }
  });

  app.post('/api/attendance', async (req, res) => {
    const { studentId, photo, date } = req.body;
  
    if (!studentId) {
      return res.status(400).send('Student ID is required.');
    }
  
    try {
      console.log("Request body:", req.body);
  
      // Define the timezone
      const timeZone = 'Asia/Shanghai'; 
      const now = new Date();
      const formattedTimestamp = format(now, 'yyyy-MM-dd HH:mm:ss', { timeZone });
      const formattedDate = format(new Date(date), 'yyyy-MM-dd', { timeZone });
  
      // Update the attendance record in the database
      const [result] = await pool.query(
        `UPDATE attendance 
         SET time_in = ?, status = ?, photo = ?
         WHERE student_id = ? AND attendance_date = ?`,
        [
          formattedTimestamp, // time_in
          'PRESENT',          // status
          photo,              // photo
          studentId,          // student_id
          formattedDate       // attendance_date
        ]
      );
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "No matching attendance record found to update." });
      }
  
      res.status(200).send({ message: "Attendance updated successfully!" });
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).send("Failed to update attendance.");
    }
  });
  
 
  app.get('/api/attendance', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          attendance.id,
          attendance.student_id,
          students.name,
          attendance.attendance_date,
          attendance.status,
          attendance.photo
        FROM attendance
        JOIN students ON attendance.student_id = students.id
      `);
      
      // Convert attendance_date to ISO format
      const formattedRows = rows.map((row) => ({
        ...row,
        attendance_date: new Date(row.attendance_date).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })
      }));
  
      res.status(200).json(formattedRows);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      res.status(500).send('Failed to fetch attendance.');
    }
  });

  
  app.post("/api/start-attendance", async (req, res) => {
    try {
      const { section, type, start_time, end_time, subject_id } = req.body;
  
      // Fetch all students
      const [students] = await pool.query("SELECT id FROM students");
  
      // Prepare attendance records
      const attendanceRecords = students.map((student) => [
        student.id,
        new Date(), // attendance_date (today's date)
        section,
        "", // time_in left blank
        "ABSENT", // Default status
        subject_id,
        type,
        start_time,
        end_time,
        "", // photo left blank
      ]);
  
      // Bulk insert attendance records
      const insertQuery = `
        INSERT INTO attendance 
        (student_id, attendance_date, section, time_in, status, subject_id, type, start_time, end_time, photo)
        VALUES ?
      `;
      await pool.query(insertQuery, [attendanceRecords]);
  
      return res.status(200).json({ message: "Attendance started successfully" });
    } catch (error) {
      console.error("Error starting attendance:", error);
      res.status(500).json({ error: "An error occurred while starting attendance." });
    }
  });



  app.get("/api/attendance/monthly", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          MONTHNAME(attendance_date) AS month,
          status,
          COUNT(*) AS count
        FROM attendance
        GROUP BY MONTH(attendance_date), status
        ORDER BY MONTH(attendance_date);
      `);
  
      // Transform data into a structure suitable for charting
      const months = [...new Set(rows.map(row => row.month))]; // Unique months
      const attendanceData = months.map(month => {
        const monthRows = rows.filter(row => row.month === month);
        return {
          month,
          present: monthRows.find(row => row.status === "PRESENT")?.count || 0,
          absent: monthRows.find(row => row.status === "ABSENT")?.count || 0,
          late: monthRows.find(row => row.status === "LATE")?.count || 0,
        };
      });
  
      res.json(attendanceData);
    } catch (error) {
      console.error("Error fetching monthly attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  app.get("/api/attendance/overview", async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          status,
          COUNT(*) AS count
        FROM attendance
        GROUP BY status;
      `);
  
      const attendanceBreakdown = rows.map(row => row.count);
  
      res.json({
        attendanceBreakdown,
      });
    } catch (error) {
      console.error("Error fetching attendance overview data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const [[{ totalStudents }]] = await pool.query(`SELECT COUNT(*) AS totalStudents FROM students;`);
      const [[{ totalClasses }]] = await pool.query(`SELECT COUNT(*) AS totalClasses FROM classes;`);
      const [[{ totalAttendanceEntries }]] = await pool.query(`SELECT COUNT(*) AS totalAttendanceEntries FROM attendance;`);
      const [[{ totalPresentEntries }]] = await pool.query(`SELECT COUNT(*) AS totalPresentEntries FROM attendance WHERE status = 'PRESENT';`);
  
      const attendanceRate = totalAttendanceEntries > 0 
        ? (totalPresentEntries / totalAttendanceEntries) * 100 
        : 0;
  
      res.json({
        totalStudents,
        totalClasses,
        attendanceRate: attendanceRate.toFixed(1)  // Format as a percentage with two decimal places
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.delete('/api/attendance/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if the record exists
      const [record] = await pool.query('SELECT * FROM attendance WHERE id = ?', [id]);
      if (record.length === 0) {
        return res.status(404).json({ message: 'Attendance record not found.' });
      }
  
      // Delete the record
      await pool.query('DELETE FROM attendance WHERE id = ?', [id]);
      res.status(200).json({ message: 'Attendance record deleted successfully.' });
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      res.status(500).json({ error: 'Failed to delete attendance record.' });
    }
  });
  
  app.put('/api/attendance/:id', async (req, res) => {
    const { id } = req.params;
    const { student_id, time_in, attendance_date, status, photo } = req.body;
  
    if (!student_id || !time_in || !attendance_date || !status) {
      return res.status(400).send('All fields are required.');
    }
  
    try {
      // Log the received values
      console.log("Received values:", { student_id, time_in, attendance_date, status, photo });
  
      // Combine attendance_date and time_in to create a valid Date object
      const combinedDateTime = `${attendance_date}T${time_in}`;
      const parsedDate = new Date(attendance_date);
      const parsedTimeIn = new Date(combinedDateTime);
  
      if (isNaN(parsedDate.getTime()) || isNaN(parsedTimeIn.getTime())) {
        return res.status(400).send('Invalid date or time value.');
      }
  
      // Define the timezone
      const timeZone = 'Asia/Shanghai';
      const formattedDate = format(parsedDate, 'yyyy-MM-dd', { timeZone });
      const formattedTimeIn = format(parsedTimeIn, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  
      // Update the attendance record in the database
      const [result] = await pool.query(
        `UPDATE attendance 
         SET student_id = ?, time_in = ?, attendance_date = ?, status = ?, photo = ?
         WHERE id = ?`,
        [student_id, formattedTimeIn, formattedDate, status, photo, id]
      );
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "No matching attendance record found to update." });
      }
  
      res.status(200).send({ message: "Attendance updated successfully!" });
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).send("Failed to update attendance.");
    }
  });


app.post('/api/add-students', async (req, res) => {
  const { student_id, name, section, email, phone, address, photo, classification } = req.body;

  if (!student_id || !name || !section || !classification) {
    return res.status(400).json({ error: 'Student ID, name, section, and classification are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO students (student_id, name, section, email, phone, address, photo, classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [student_id, name, section, email, phone, address, photo, classification]
    );
    res.status(201).json({ message: 'Student added successfully!', id: result.insertId });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student.' });
  }
});

app.get("/api/attendance/daily", async (req, res) => {
  try {
    // Define the timezone
    const timeZone = 'Asia/Shanghai';

    // Get today's local date in the desired timezone
    const now = new Date();
    const localDate = format(now, 'yyyy-MM-dd', { timeZone });

    // Query attendance records for the local date
    const [rows] = await pool.query(`
      SELECT 
        attendance.id,
        students.name AS name,
        attendance.attendance_date,
        attendance.status
      FROM attendance
      JOIN students ON attendance.student_id = students.id
      WHERE DATE(attendance.attendance_date) = ?;
    `, [localDate]);

    // Format the response to ensure the `attendance_date` is displayed in the local timezone
    const formattedRows = rows.map((row) => ({
      ...row,
      attendance_date: format(new Date(row.attendance_date), 'yyyy-MM-dd', { timeZone }),
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("Error fetching daily attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/attendance/weekly", async (req, res) => {
  try {
    // Define the timezone
    const timeZone = "Asia/Shanghai";

    // Get the current date and calculate the date 7 days ago
    const now = new Date();
    const startDate = format(subDays(now, 7), "yyyy-MM-dd", { timeZone });
    const endDate = format(now, "yyyy-MM-dd", { timeZone });

    // Query weekly attendance records
    const [rows] = await pool.query(
      `
      SELECT 
        students.student_id,
        students.name AS name,
        students.section,
        attendance.attendance_date,
        attendance.status
      FROM 
        attendance
      JOIN 
        students 
      ON 
        attendance.student_id = students.id
      WHERE 
        DATE(attendance.attendance_date) BETWEEN ? AND ?
      ORDER BY 
        students.section, students.name, attendance.attendance_date;
      `,
      [startDate, endDate]
    );

    // Format the response to ensure `attendance_date` is displayed in the local timezone
    const formattedRows = rows.map((row) => ({
      ...row,
      attendance_date: format(new Date(row.attendance_date), "yyyy-MM-dd", {
        timeZone,
      }),
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error("Error fetching weekly attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/attendance/monthlyreport", async (req, res) => {
  try {
    const today = new Date();
    const start = format(startOfMonth(today), 'yyyy-MM-dd'); // Start of the month
    const end = format(endOfMonth(today), 'yyyy-MM-dd'); // End of the month

    const [rows] = await pool.query(`
      SELECT 
        attendance.id,
        students.name AS studentName,
        attendance.attendance_date,
        attendance.status
      FROM attendance
      JOIN students ON attendance.student_id = students.id
      WHERE attendance.attendance_date BETWEEN ? AND ?;
    `, [start, end]);

    console.log("Raw rows:", rows); // Log the raw rows

    const formattedRows = rows.map((row) => ({
      ...row,
      attendance_date: format(new Date(row.attendance_date), 'yyyy-MM-dd'),
    }));

    console.log("Formatted rows:", formattedRows); // Log the formatted rows

    res.json({ attendance: formattedRows });
  } catch (error) {
    console.error("Error fetching monthly attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/attendance/yearly", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        YEAR(attendance_date) AS year,
        COUNT(*) AS attendance_count,
        SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_count
      FROM attendance
      GROUP BY YEAR(attendance_date)
      ORDER BY year;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching yearly attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/professors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "teacher"');
    const count = rows[0].count;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching professors count:', error);
    res.status(500).send('Failed to fetch professors count.');
  }
});

// Add this endpoint to fetch accounts
app.post('/api/accounts', async (req, res) => {
  const { email, role, password } = req.body;

  if (!email || !role || !password) {
    return res.status(400).json({ error: 'Email, role, and password are required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO users (email, role, password) VALUES (?, ?, ?)',
      [email, role, password]
    );

    const newAccount = {
      id: result.insertId,
      email,
      role,
    };

    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error adding account:', error);
    res.status(500).send('Failed to add account.');
  }
});

app.put('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required.' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE users SET email = ?, role = ? WHERE id = ?',
      [email, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "No matching account found to update." });
    }

    const updatedAccount = {
      id: parseInt(id, 10),
      email,
      role,
    };

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).send('Failed to update account.');
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "No matching account found to delete." });
    }

    res.status(200).send({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).send('Failed to delete account.');
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, role FROM users');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).send('Failed to fetch accounts.');
  }
});

  // Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  