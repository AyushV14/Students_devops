const db = require("../config/db");


const createStudent = async (name, age, email) => {
  const [result] = await db.execute(
    "INSERT INTO students (name, age, email) VALUES (?, ?, ?)",
    [name, age, email]
  );
  return { id: result.insertId, name, age, email };
};


const getAllStudents = async () => {
  const [rows] = await db.execute("SELECT * FROM students");
  return rows;
};


const getStudentById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM students WHERE id = ?", [id]);
  return rows[0];
};


const updateStudent = async (id, name, age, email) => {
  await db.execute(
    "UPDATE students SET name = ?, age = ?, email = ? WHERE id = ?",
    [name, age, email, id]
  );
  return { id, name, age, email };
};


const deleteStudent = async (id) => {
  await db.execute("DELETE FROM students WHERE id = ?", [id]);
  return { message: `Student with id ${id} deleted` };
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
