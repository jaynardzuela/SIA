import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AttendanceForm() {
  const [type, setType] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const payload = {
      type,
      section,
      start_time: startTime,
      end_time: endTime,
      subject_id: subjectId,
    };

    try {
      // Send the form data to the API
      await axios.post("http://localhost:5000/api/start-attendance", payload);
      alert("Attendance started successfully!");

      // Redirect to the /attendancepage route
      navigate("/attendancepage");
    } catch (error) {
      console.error("Error starting attendance:", error);
      alert("Failed to start attendance. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-6">
        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecture">Lecture</SelectItem>
              <SelectItem value="laboratory">Laboratory</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Section */}
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select onValueChange={setSection}>
            <SelectTrigger id="section">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SBIT3I">SBIT3I</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Start Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Time</Label>
            <Select onValueChange={setStartTime}>
              <SelectTrigger id="start">
                <SelectValue placeholder="9:00" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={`${i}:00`}>
                    {`${String(i).padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <Label htmlFor="end">End Time</Label>
            <Select onValueChange={setEndTime}>
              <SelectTrigger id="end">
                <SelectValue placeholder="11:00" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={`${i}:00`}>
                    {`${String(i).padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select onValueChange={setSubjectId}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SIA101">
                SIA101: System Integrations and Architecture
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Submit Button */}
      <div className="mt-6">
        <Button type="submit" className="w-full" size="lg">
          Start Attendance
        </Button>
      </div>
    </form>
  );
}
