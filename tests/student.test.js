const request = require("supertest");
const express = require("express");
const studentRoutes = require("../src/routes/studentRoutes");

// Mock the student model
jest.mock("../src/models/studentModel", () => ({
  createStudent: jest.fn(),
  getAllStudents: jest.fn(),
  getStudentById: jest.fn(),
  updateStudent: jest.fn(),
  deleteStudent: jest.fn(),
}));

const studentModel = require("../src/models/studentModel");

const app = express();
app.use(express.json());
app.use("/api/v1/students", studentRoutes);

describe("Student API", () => {
  let studentId = 1;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test adding a new student
  it("should add a new student", async () => {
    const mockStudent = {
      id: 1,
      name: "Test User",
      age: 25,
      email: "testuser@example.com"
    };
    
    studentModel.createStudent.mockResolvedValue(mockStudent);

    const res = await request(app)
      .post("/api/v1/students")
      .send({
        name: "Test User",
        age: 25,
        email: "testuser@example.com"
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mockStudent);
    expect(studentModel.createStudent).toHaveBeenCalledWith("Test User", 25, "testuser@example.com");
  });

  // Test getting all students
  it("should get all students", async () => {
    const mockStudents = [
      { id: 1, name: "Test User", age: 25, email: "testuser@example.com" }
    ];
    
    studentModel.getAllStudents.mockResolvedValue(mockStudents);

    const res = await request(app).get("/api/v1/students");
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockStudents);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test getting student by ID
  it("should get student by id", async () => {
    const mockStudent = {
      id: studentId,
      name: "Test User",
      age: 25,
      email: "testuser@example.com"
    };
    
    studentModel.getStudentById.mockResolvedValue(mockStudent);

    const res = await request(app).get(`/api/v1/students/${studentId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockStudent);
    expect(studentModel.getStudentById).toHaveBeenCalledWith(studentId.toString());
  });

  // Test getting non-existent student
  it("should return 404 for non-existent student", async () => {
    studentModel.getStudentById.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/students/999");
    
    expect(res.statusCode).toBe(404);
  });

  // Test updating student
  it("should update student", async () => {
    const mockUpdatedStudent = {
      id: studentId,
      name: "Updated User",
      age: 26,
      email: "updateduser@example.com"
    };
    
    studentModel.updateStudent.mockResolvedValue(mockUpdatedStudent);

    const res = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .send({
        name: "Updated User",
        age: 26,
        email: "updateduser@example.com"
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUpdatedStudent);
    expect(studentModel.updateStudent).toHaveBeenCalledWith(
      studentId.toString(),
      "Updated User",
      26,
      "updateduser@example.com"
    );
  });

  // Test deleting student
  it("should delete student", async () => {
    const mockResult = { message: `Student with id ${studentId} deleted` };
    
    studentModel.deleteStudent.mockResolvedValue(mockResult);

    const res = await request(app).delete(`/api/v1/students/${studentId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockResult);
    expect(studentModel.deleteStudent).toHaveBeenCalledWith(studentId.toString());
  });
});
