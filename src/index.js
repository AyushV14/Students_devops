const express = require("express");
const dotenv = require("dotenv");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
const app = express();
const db = require("./config/db");

app.use(express.json());

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("DB test result:", rows[0].result); // should log 2
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}

testDB();

app.get("/api/v1/healthcheck", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/students", studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
