import { useEffect, useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import "../styles/table.css";
import "../styles/modal.css";
import "../styles/header.css";
import { Plus, Search, Eye } from "lucide-react";
import TeacherHeader from "../components/TeacherHeader";

// Dynamically import all images from the images folder
const studentPhotos = import.meta.glob("../images/*", {
  eager: true,
}) as Record<string, any>;

// Define the Student type
type Student = {
  id: number;
  student_id: number;
  name: string;
  section: string;
  email?: string;
  phone?: string;
  address?: string;
  photo: string;
  photoIndex?: number;
};

function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((response) => response.json())
      .then((data) => {
        const updatedStudents = data.map((student: Student, index: number) => ({
          ...student,
          photoIndex: studentPhotos.length
            ? index % studentPhotos.length
            : null,
        }));
        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);
      })
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toString().includes(searchTerm) ||
        student.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSort = (field: keyof Student) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedData = [...filteredStudents].sort((a, b) => {
      if (a[field] !== undefined && b[field] !== undefined) {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredStudents(sortedData);
  };

  const openModal = (student: Student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewStudent({});
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.student_id || !newStudent.section) {
      setError("Please fill in all required fields.");
      return;
    }

    // Here you would typically make an API call to add the student
    // For this example, we'll just add it to the local state
    const addedStudent = {
      ...newStudent,
      id: students.length + 1,
      photo: "placeholder.png",
    } as Student;

    setStudents([...students, addedStudent]);
    closeAddModal();
  };

  return (
    <>
      <div className="nav">
        <TeacherSidebar />
      </div>
      <TeacherHeader />
      <div className="main">
        <div className="table-controls">
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                pointerEvents: "none", // Prevent icon from interfering with input
              }}
            />
          </div>

          <button className="add-button" onClick={openAddModal}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Plus size={24} />
              <span style={{ marginLeft: "5px", fontWeight: "700" }}>
                Add Student
              </span>
            </div>
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("student_id")}>
                  Student ID
                  {sortField === "student_id" && (
                    <span className={`sort-icon ${sortOrder}`}></span>
                  )}
                </th>
                <th onClick={() => handleSort("name")}>
                  Name
                  {sortField === "name" && (
                    <span className={`sort-icon ${sortOrder}`}></span>
                  )}
                </th>
                <th onClick={() => handleSort("section")}>
                  Section
                  {sortField === "section" && (
                    <span className={`sort-icon ${sortOrder}`}></span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  <td>{student.section}</td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => openModal(student)}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Eye size={20} style={{ marginRight: "8px" }} />
                        <p style={{ fontWeight: "700" }}>View Profile</p>
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedStudent && (
          <div
            className={`modal-overlay ${selectedStudent ? "active" : ""}`}
            onClick={closeModal}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Profile</h2>
                <button className="modal-close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <img
                  src={
                    selectedStudent.photo
                      ? `src/images/${selectedStudent.photo}`
                      : Object.values(studentPhotos).find(
                          (photoPath) =>
                            typeof photoPath === "string" &&
                            photoPath.includes(
                              selectedStudent.student_id.toString()
                            )
                        ) || "src/images/placeholder/placeholder.png"
                  }
                  alt={`${selectedStudent.name}'s photo`}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                <p>
                  <strong>Student ID:</strong> {selectedStudent.student_id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedStudent.name}
                </p>
                <p>
                  <strong>Section:</strong> {selectedStudent.section}
                </p>
                <p>
                  <strong>Email:</strong> {selectedStudent.email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedStudent.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedStudent.address || "N/A"}
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className={`modal-overlay active`} onClick={closeAddModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Student</h2>
                <button className="modal-close" onClick={closeAddModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="student_id">Student ID</label>
                  <input
                    type="number"
                    id="student_id"
                    name="student_id"
                    value={newStudent.student_id || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newStudent.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="section">Section</label>
                  <input
                    type="text"
                    id="section"
                    name="section"
                    value={newStudent.section || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newStudent.email || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newStudent.phone || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newStudent.address || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
              </div>
              <div className="modal-footer">
                <button onClick={handleAddStudent}>Add Student</button>
                <button onClick={closeAddModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentList;
