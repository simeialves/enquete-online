const express = require("express");
const serverless = require("serverless-http");

const SurveyController = require("./controllers/SurveyController");
const SurveyItemsController = require("./controllers/SurveyItemsController");
const PollItemsController = require("./controllers/PollItemsController");

const app = express();

const swagger = require("./swagger.js");

app.use(express.json());

//#region SURVEY
app.post("/survey", SurveyController.createSurvey);
app.get("/survey", SurveyController.getSurvey);
app.get("/survey/:id", SurveyController.getSurveyById);
app.put("/survey/:id", SurveyController.updateSurvey);
app.delete("/survey/:id", SurveyController.deleteSurvey);
//#endregion

//#region SURVEY-ITEMS
app.post("/survey-items", SurveyItemsController.createSurveyItems);
app.get("/survey-items", SurveyItemsController.getSurveyItems);
app.get("/survey-items/:id", SurveyItemsController.getSurveyItemsById);
app.get(
  "/survey-items/survey/:surveyId",
  SurveyItemsController.getSurveyItemsBySurveyId
);
app.put("/survey-items/:id", SurveyItemsController.updateSurveyItems);
app.delete("/survey-items/:id", SurveyItemsController.deleteSurveyItems);
//#endregion

//#region POLL-ITEMS
app.post("/poll-items", PollItemsController.createPollItems);
app.get("/poll-items", PollItemsController.getPollItems);
app.get("/poll-items/:id", PollItemsController.getPollItemsById);
app.get(
  "/poll-items/surveyItems/:surveyItemId",
  PollItemsController.getPollItemsBySurveyItemId
);
app.put("/poll-items/:id", PollItemsController.updatePollItems);
app.delete("/poll-items/:id", PollItemsController.deletePollItems);

//#endregion

//#region ADDITIONAL ROUTES
app.use("/api-docs", swagger.serveSwaggerUI, swagger.setupSwaggerUI);

app.get("/", async function (req, res) {
  res.json({ message: "Página Inicial do Sistema Enquete-Online" });
});

app.get("/ping", async function (req, res) {
  res.json({ message: "pong" });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});
//#endregion

module.exports.handler = serverless(app);
