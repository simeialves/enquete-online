const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const app = express();

app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Api de Enquete-Online",
      version: "1.0.0",
      description: "Api de Enquete-Online",
    },
  },
  apis: ["./index.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, () => {
  console.log(
    "Swagger documentation available at https://localhost:5000/api-docs"
  );
});
