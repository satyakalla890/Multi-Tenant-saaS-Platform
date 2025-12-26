const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");
const tenantRoutes = require("./routes/tenant.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.use("/api/tenants", tenantRoutes);

module.exports = app;
