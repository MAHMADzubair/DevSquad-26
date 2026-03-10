const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "Simple REST API for managing tasks",
    },
    servers: [
      {
        url: "/",
        description: "Vercel Deployment (Current Environment)",
      },
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")], // keep routes documentation
};

module.exports = swaggerJsdoc(options);