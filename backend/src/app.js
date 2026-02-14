const dotenv = require("dotenv");
// Load environment variables
dotenv.config();

const express = require("express");
const cors = require("cors");
const db = require("../database");


const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const userRoutes = require("./routes/user.routes");
const tenantRoutes = require("./routes/tenant.routes");
const taskRoutes = require("./routes/task.routes");
const healthRoutes = require("./routes/health.routes");

const app = express();

// Enable CORS for frontend

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


// JSON parser
app.use(express.json());

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
