import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Student {
  id: number;
  name: string;
  student_id: string;
}

interface Props {
  onSelectStudent: (student: Student) => void;
}

const StudentSelectorWithCamera: React.FC<Props> = ({ onSelectStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        setStudents(response.data);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        if (error.response) {
          setError(
            `Failed to load students: ${error.response.status} ${error.response.data}`
          );
        } else if (error.request) {
          setError("Failed to load students: No response from server");
        } else {
          setError("Failed to load students: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleBarcodeDetected = (barcode: string) => {
    const foundStudent = students.find(
      (student) => student.student_id.toLowerCase() === barcode.toLowerCase()
    );

    if (foundStudent) {
      onSelectStudent(foundStudent);
      console.log("Student found:", foundStudent.name);
    } else {
      alert("Student not found!");
    }
  };

  const handleEndAttendance = () => {
    setIsModalOpen(true);
  };

  const confirmEndAttendance = async () => {
    if (password === "secret") {
      alert("Attendance ended successfully!");
      navigate("/studentattendance");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Scan Barcode with Camera
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative mx-auto" style={{ width: 500, height: 400 }}>
            <BarcodeScannerComponent
              width={500}
              height={400}
              onUpdate={(err, result) => {
                if (result) {
                  handleBarcodeDetected(result.getText());
                } else if (err) {
                  console.error("Barcode scan error:", err);
                  setError("Unable to read barcode. Please try again.");
                }
              }}
            />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
          </div>
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}
          <p className="text-gray-600 text-center">
            Position the barcode within the frame to scan
          </p>
          <button
            onClick={handleEndAttendance}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            End Attendance
          </button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle>Confirm End Attendance</DialogTitle>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out mr-2"
            >
              Cancel
            </button>
            <button
              onClick={confirmEndAttendance}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSelectorWithCamera;
