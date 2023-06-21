const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const SURVEY_TABLE = process.env.SURVEY_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

//#region CREATE
app.post("/users", async function (req, res) {
  const { userId, name, age } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
      age: age,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, name, age });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.post("/survey", async function (req, res) {
  const { surveyId, name, status } = req.body;
  console.log(req.body);
  if (typeof surveyId !== "string") {
    res.status(400).json({ error: '"surveyId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof status !== "string") {
    res.status(400).json({ error: '"status" must be a string' });
  }

  const params = {
    TableName: SURVEY_TABLE,
    Item: {
      surveyId: surveyId,
      name: name,
      status: status,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ surveyId, name, status });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not create survey", message: error.message });
  }
});

//#endregion

//#region READ
app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.get("/ping", async function (req, res) {
  res.json({ message: "pong" });
});
//#endregion

//#region UPDATE

//#endregion

//#region DELETE

//#endregion

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
