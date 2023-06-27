const express = require("express");
const serverless = require("serverless-http");

const SurverController = require("./controllers/SurverController");
const SurverItemsController = require("./controllers/SurverItemsController");
const PollItemsController = require("./controllers/PollItemsController");

const app = express();

app.use(express.json());

//#region SURVEY
app.post("/survey", SurverController.createSurvey);
app.get("/survey", SurverController.getSurvey);
app.get("/survey/:surveyId", SurverController.getSurveyById);
app.put("/survey/:surveyId", SurverController.updateSurvey);
app.delete("/survey/:surveyId", SurverController.deleteSurvey);
//#endregion

//#region SURVEY-ITEMS
app.post("/survey-items", SurverItemsController.createSurveyItems);
app.get("/survey-items", SurverItemsController.getSurveyItems);
app.get(
  "/survey-items/:surveyItemId",
  SurverItemsController.getSurveyItemsById
);
app.get(
  "/survey-items/survey/:surveyId",
  SurverItemsController.getSurveyItemsBySurveyId
);
app.put("/survey-items/:surveyItemId", SurverItemsController.updateSurveyItems);
app.delete(
  "/survey-items/:surveyItemId",
  SurverItemsController.deleteSurveyItems
);
//#endregion

//#region POLL-ITEMS
app.post("/poll-items", PollItemsController.createPollItems);
app.get("/poll-items", PollItemsController.getPollItems);
app.get("/poll-items/:pollItemId", PollItemsController.getPollItemsById);
app.get(
  "/poll-items/surveyItems/:surveyItemId",
  PollItemsController.getPollItemsBySurveyItemId
);
app.put("/poll-items/:pollItemId", PollItemsController.updatePollItems);
app.delete("/poll-items/:pollItemId", PollItemsController.deletePollItems);

//#endregion

//#region ADDITIONAL ROUTES
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
