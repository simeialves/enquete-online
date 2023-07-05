const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Enquete-Online",
      version: "1.0.0",
      description: "API",
    },
  },
  apis: [
    "./docs/SurveyDocs.js",
    "./docs/SurveyItemsDocs.js",
    "./docs/PollItemsDocs.js",
  ],
};

const swaggerSpec = swaggerJsDoc(options);

const serveSwaggerUI = swaggerUi.serve;
const setupSwaggerUI = swaggerUi.setup(swaggerSpec);

module.exports = {
  swaggerSpec,
  serveSwaggerUI,
  setupSwaggerUI,
};
