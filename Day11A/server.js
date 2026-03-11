require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

/* Connect Database */
connectDB();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

/* Swagger Documentation */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Default Route */
app.get("/api", (req, res) => {
  res.send("Task Manager API Running 🚀");
});

/* Serve Frontend Static Files */
app.use(express.static(path.join(__dirname, "Frontend")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

/* Server Port */
const PORT = process.env.PORT || 3000;

/* Start Server */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
