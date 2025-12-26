const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");
const tenantRoutes = require("./routes/tenant.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.use("/api/tenants", tenantRoutes);

app.use("/api", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api", taskRoutes);

module.exports = app;
