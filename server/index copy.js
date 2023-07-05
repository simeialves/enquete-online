const express = require("express");
const serverless = require("serverless-http");

const SurverController = require("./controllers/SurverController");
const SurverItemsController = require("./controllers/SurverItemsController");
const PollItemsController = require("./controllers/PollItemsController");

const app = express();

app.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Survey:
 *       type: object
 *       properties:
 *         SurveyId:
 *           type: string
 *           description: ID da enquete
 *         name:
 *           type: string
 *           name: Nome da enquete
 *         status:
 *           type: string
 *           description: Status da enquete
 *      SurveyItems:
 *       type: object
 *       properties:
 *         SurveyItemId:
 *           type: string
 *           description: ID do item da enquete
 *         SurveyId:
 *           type: string
 *           description: ID da enquete
 *         description:
 *           type: string
 *           name: Descrição do item da enquete
 *         Votes:
 *           type: string
 *           description: Quantidade de Votos
 *      PollItems:
 *       type: object
 *       properties:
 *         PollItemId:
 *           type: string
 *           description: ID do item da votação
 *         SurveyItemId:
 *           type: string
 *           description: ID do item da enquete
 */

/**
 * @swagger
 * /survey:
 *   get:
 *     summary: Retorna todas as enquetes
 *     responses:
 *       200:
 *         description: Lista de Enquetes.
 *   post:
 *     summary: Cria uma nova enquete.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Enquete criada com sucesso.
 * /survey-items:
 *   get:
 *     summary: Retorna todos os itens das enquetes
 *     responses:
 *       200:
 *         description: Lista de itens das enquetes.
 *   post:
 *     summary: Cria uma novo item da enquete.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyItems'
 *     responses:
 *       200:
 *         description: Item criado com sucesso.
 * /poll-items:
 *   get:
 *     summary: Retorna todas os votos.
 *     responses:
 *       200:
 *         description: Lista de votos.
 *   post:
 *     summary: Adiciona um novo voto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PollItems'
 *     responses:
 *       200:
 *         description: Enquete criada com sucesso.
 */

/**
 * @swagger
 * /survey/{id}:
 *   put:
 *     summary: Atualiza uma enquete existente.
 *     parameters:
 *       - in: path
 *         name: SurveyId
 *         required: true
 *         description: ID da enquete a ser atualizada.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       200:
 *         description: Enquete atualizada com sucesso.
 *   delete:
 *     summary: Remove uma enquete existente.
 *     parameters:
 *       - in: path
 *         name: SurveyId
 *         required: true
 *         description: ID da enquete a ser removida.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Enquete removida com sucesso.
 * /survey-items/{id}:
 *   put:
 *     summary: Atualiza uma item da enquete existente.
 *     parameters:
 *       - in: path
 *         name: SurveyItemId
 *         required: true
 *         description: ID do item da enquete a ser atualizada.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyItems'
 *     responses:
 *       200:
 *         description: Item da enquete atualizada com sucesso.
 *   delete:
 *     summary: Remove um item da enquete existente.
 *     parameters:
 *       - in: path
 *         name: SurveyItemId
 *         required: true
 *         description: ID do item da enquete a ser removida.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item da enquete removida com sucesso.
 * /poll-items/{id}:
 *   put:
 *     summary: Atualiza um voto existente.
 *     parameters:
 *       - in: path
 *         name: PollItemId
 *         required: true
 *         description: ID do voto da enquete a ser atualizada.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PollItems'
 *     responses:
 *       200:
 *         description: Voto atualizado com sucesso.
 *   delete:
 *     summary: Remove um voto da enquete existente.
 *     parameters:
 *       - in: path
 *         name: PollItemId
 *         required: true
 *         description: ID do voto da enquete a ser removida.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Voto removido com sucesso.
 */

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
