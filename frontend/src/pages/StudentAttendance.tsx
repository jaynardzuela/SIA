"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherHeader from "../components/TeacherHeader";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Printer, FileText, NotebookPen, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import AttendanceForm from "../components/AttendanceForm"; // Import the AttendanceForm component

// Define the Student interface
interface AttendanceRecord {
  id: number;
  student_id: number;
  time_in: string;
  attendance_date: string;
  status: string;
  photo: string;
}

interface Student {
  id: number;
  attendance_id: number;
  name: string;
  timeIn: string;
  date: string;
  status: string;
  photo: string;
}

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [year, setYear] = useState<string>("2024");
  const [month, setMonth] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // State for selected student
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false); // State for update modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch attendance data
        const attendanceResponse = await axios.get<AttendanceRecord[]>(
          "http://localhost:5000/api/attendance"
        );
        const attendanceData = attendanceResponse.data;

        // Fetch student data
        const studentsResponse = await axios.get<
          { id: number; name: string }[]
        >("http://localhost:5000/api/students");
        const studentsData = studentsResponse.data;

        // Create a map for quick lookup of student names
        const studentMap = new Map<number, string>(
          studentsData.map((student) => [student.id, student.name])
        );

        // Define the desired timezone
        const timeZone = "Asia/Shanghai";

        // Merge attendance with student names
        const mergedData: Student[] = attendanceData.map((record) => ({
          id: record.student_id,
          attendance_id: record.id,
          name: studentMap.get(record.student_id) || "Unknown",
          timeIn: record.time_in,
          // Adjust the attendance date to match the backend's timezone
          date: new Intl.DateTimeFormat("en-CA", {
            timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(new Date(record.attendance_date)),
          status: record.status,
          photo: record.photo,
        }));

        setStudents(mergedData); // Set merged data in state
        setFilteredStudents(mergedData); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleFilter = () => {
    const filtered = students.filter((student) => {
      const studentDate = new Date(student.date); // Parse the date string

      const matchesYear =
        year === "all" || studentDate.getFullYear().toString() === year;
      const matchesMonth =
        month === "all" ||
        studentDate
          .toLocaleString("default", { month: "long" })
          .toLowerCase() === month;
      const matchesStatus =
        status === "all" || student.status.toLowerCase() === status;
      const matchesSearch =
        searchQuery === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesMonth && matchesStatus && matchesSearch;
    });

    setFilteredStudents(filtered);
  };

  const handleNavigation = () => {
    navigate("/");
  };

  const handleUpdate = (student: Student) => {
    setSelectedStudent(student);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (updatedStudent: Student) => {
    try {
      const payload = {
        student_id: updatedStudent.id,
        time_in: updatedStudent.timeIn,
        attendance_date: updatedStudent.date,
        status: updatedStudent.status,
        photo: updatedStudent.photo,
      };

      await axios.put(
        `http://localhost:5000/api/attendance/${updatedStudent.attendance_id}`,
        payload
      );

      setStudents((prev) =>
        prev.map((s) =>
          s.attendance_id === updatedStudent.attendance_id ? updatedStudent : s
        )
      );
      setFilteredStudents((prev) =>
        prev.map((s) =>
          s.attendance_id === updatedStudent.attendance_id ? updatedStudent : s
        )
      );
      setIsUpdateModalOpen(false);
      alert("Attendance record updated successfully.");
    } catch (error) {
      console.error("Error updating attendance record:", error);
      alert("Failed to update the attendance record. Please try again.");
    }
  };

  return (
    <>
      <div className="nav">
        <TeacherSidebar />
      </div>
      <TeacherHeader />
      <div className="main">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                SBIT 31 - STUDENT ATTENDANCE LOG
              </h1>
              <div className="text-sm text-muted-foreground">
                Subject: SIA101 • Time: 9:00-11:00 AM
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <NotebookPen className="mr-2 h-4 w-4" />
                    Start Attendance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogTitle onClick={handleNavigation}>
                    Start Attendance
                  </DialogTitle>
                  <AttendanceForm />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            Attendance Records
          </h1>
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                    <SelectItem value="april">April</SelectItem>
                    <SelectItem value="may">May</SelectItem>
                    <SelectItem value="june">June</SelectItem>
                    <SelectItem value="july">July</SelectItem>
                    <SelectItem value="august">August</SelectItem>
                    <SelectItem value="september">September</SelectItem>
                    <SelectItem value="october">October</SelectItem>
                    <SelectItem value="november">November</SelectItem>
                    <SelectItem value="december">December</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name"
                  className="border rounded px-4 py-2 w-full"
                />
                <Button variant="outline" size="sm" onClick={handleFilter}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NAME</TableHead>
                        <TableHead>TIME IN</TableHead>
                        <TableHead>DATE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <TableRow key={`${student.id}-${index}`}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.timeIn}</TableCell>
                          <TableCell>{student.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={
                                student.status === "PRESENT"
                                  ? "bg-green-500"
                                  : student.status === "LATE"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedStudent(student)}
                                >
                                  <Eye size={20} />
                                  View
                                </Button>
                              </DialogTrigger>
                              {selectedStudent && (
                                <DialogContent
                                  className="sm:max-w-[425px]"
                                  aria-describedby="student-details-description"
                                >
                                  <DialogTitle>Student Details</DialogTitle>
                                  <div
                                    id="student-details-description"
                                    className="space-y-4"
                                  >
                                    <img
                                      src={selectedStudent.photo}
                                      alt={`${selectedStudent.name}'s larger photo`}
                                      className="w-full h-auto rounded-lg"
                                    />
                                    <div>
                                      <p>
                                        <strong>Name:</strong>{" "}
                                        {selectedStudent.name}
                                      </p>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {selectedStudent.date}
                                      </p>
                                      <p>
                                        <strong>Time In:</strong>{" "}
                                        {selectedStudent.timeIn}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>
                                        <Badge
                                          variant="default"
                                          className={
                                            selectedStudent.status === "PRESENT"
                                              ? "bg-green-500"
                                              : selectedStudent.status ===
                                                "LATE"
                                              ? "bg-orange-500"
                                              : "bg-red-500"
                                          }
                                        >
                                          {selectedStudent.status}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              )}
                            </Dialog>
                            <Button
                              variant="outline"
                              onClick={() => handleUpdate(student)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={async () => {
                                try {
                                  await axios.delete(
                                    `http://localhost:5000/api/attendance/${student.attendance_id}`
                                  );
                                  setFilteredStudents((prev) =>
                                    prev.filter(
                                      (s) =>
                                        s.attendance_id !==
                                        student.attendance_id
                                    )
                                  );
                                  setStudents((prev) =>
                                    prev.filter(
                                      (s) =>
                                        s.attendance_id !==
                                        student.attendance_id
                                    )
                                  );
                                  alert(
                                    "Attendance record deleted successfully."
                                  );
                                } catch (error) {
                                  console.error(
                                    "Error deleting attendance record:",
                                    error
                                  );
                                  alert(
                                    "Failed to delete the attendance record. Please try again."
                                  );
                                }
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && selectedStudent && (
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle>Update Student</DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateSubmit(selectedStudent);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={selectedStudent.name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedStudent.date}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        date: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time In
                  </label>
                  <input
                    type="time"
                    value={selectedStudent.timeIn}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        timeIn: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={selectedStudent.status}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        status: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="LATE">Late</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="ml-2">
                  Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
