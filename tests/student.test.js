const request = require("supertest");
const express = require("express");
const studentRoutes = require("../src/routes/studentRoutes");

const app = express();
app.use(express.json());
app.use("/api/v1/students", studentRoutes);

describe("Student API", () => {
  let studentId;

  // Test adding a new student
  it("should add a new student", async () => {
    const res = await request(app)
      .post("/api/v1/students")
      .send({
        name: "Test User",
        age: 25,
        email: "testuser@example.com"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    studentId = res.body.id; // save ID for further tests
  });

  // Test getting all students
  it("should get all students", async () => {
    const res = await request(app).get("/api/v1/students");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test getting student by ID
  it("should get student by id", async () => {
    const res = await request(app).get(`/api/v1/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", studentId);
  });

  // Test updating student
  it("should update student", async () => {
    const res = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .send({
        name: "Updated User",
        age: 26,
        email: "updateduser@example.com"
      });
    expect(res.statusCode).toBe(200);
    expect(Number(res.body.id)).toBe(studentId);   
    expect(res.body.name).toBe("Updated User");
    expect(res.body.age).toBe(26);
    expect(res.body.email).toBe("updateduser@example.com");
  });


  // Test deleting student
  it("should delete student", async () => {
    const res = await request(app).delete(`/api/v1/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    
    expect(res.body).toHaveProperty("message", `Student with id ${studentId} deleted`);
  });

  
  it("should return 404 for deleted student", async () => {
    const res = await request(app).get(`/api/v1/students/${studentId}`);
    expect(res.statusCode).toBe(404);
  });
});
