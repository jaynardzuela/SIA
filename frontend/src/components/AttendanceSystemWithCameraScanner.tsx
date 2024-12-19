import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import StudentSelectorWithCamera from "../components/StudentSelectorWIthCamera";
interface Student {
  id: number;
  name: string;
  student_id: string;
  email?: string;
  phone?: string;
  address?: string;
  section?: string;
}

const AttendanceSystemWithCameraScanner: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);
  const capturePhoto = () => {
    if (webcamRef.current) {
      const photo = webcamRef.current.getScreenshot();
      setImage(photo);
    }
  };

  const logAttendance = async () => {
    if (!selectedStudent) {
      alert("No student selected!");
      return;
    }

    if (!image) {
      alert("No photo captured!");
      return;
    }

    try {
      const timeZone = "Asia/Shanghai";
      const attendanceDate = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      console.log("Sending data to server:", {
        studentId: selectedStudent.id,
        photo: image,
        date: attendanceDate,
      });

      const response = await axios.post(
        "http://localhost:5000/api/attendance",
        {
          studentId: selectedStudent.id,
          photo: image,
          date: attendanceDate,
        }
      );

      if (response.status === 200) {
        alert("Attendance logged successfully!");
        setImage(null);
        setSelectedStudent(null);
      } else {
        alert("Failed to log attendance.");
      }
    } catch (error) {
      console.error("Error logging attendance:", error);
      alert("Failed to log attendance.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Attendance System with Camera Scanner
        </h1>
        {!selectedStudent ? (
          <StudentSelectorWithCamera
            onSelectStudent={(student) => setSelectedStudent(student)}
          />
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Student Information
              </h2>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-lg">
                  <strong>Name:</strong> {selectedStudent.name}
                </p>
                <p className="text-lg">
                  <strong>Student ID:</strong> {selectedStudent.student_id}
                </p>
                <p className="text-lg">
                  <strong>Email:</strong> {selectedStudent.email || "N/A"}
                </p>
                <p className="text-lg">
                  <strong>Phone:</strong> {selectedStudent.phone || "N/A"}
                </p>
                <p className="text-lg">
                  <strong>Address:</strong> {selectedStudent.address || "N/A"}
                </p>
                <p className="text-lg">
                  <strong>Section:</strong> {selectedStudent.section || "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                width={500}
                height={400}
                className="rounded-lg shadow-md mx-auto"
              />
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={capturePhoto}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Capture Photo
              </button>
              <button
                onClick={logAttendance}
                disabled={!image}
                className={`${
                  image
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`}
              >
                Log Attendance
              </button>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Back to Scan
            </button>
            {image && (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Captured Photo:
                </h3>
                <img
                  src={image}
                  alt="Captured"
                  className="rounded-lg shadow-md mx-auto"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystemWithCameraScanner;
