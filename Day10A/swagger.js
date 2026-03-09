const swaggerJsdoc = require("swagger-jsdoc");

const serverUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

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
        url: serverUrl,
      },
    ],
  },
  apis: ["./routes/*.js"], // keep routes documentation
};

module.exports = swaggerJsdoc(options);