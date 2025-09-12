const Student = require("../models/studentModel");

const addStudent = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const student = await Student.createStudent(name, age, email);
    res.status(201).json(student);
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ error: "Failed to add student" });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


const getStudent = async (req, res) => {
  try {
    const student = await Student.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};


const updateStudent = async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const student = await Student.updateStudent(req.params.id, name, age, email);
    res.json(student);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const result = await Student.deleteStudent(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

const testRoute = (req, res) => {
  res.json({ message: "CI/CD pipeline test successful!" });
};

module.exports = {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  testRoute,
};
