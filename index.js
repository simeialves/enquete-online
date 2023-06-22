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
const SURVEY_ITEMS_TABLE = process.env.SURVEY_ITEMS_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4: uuidv4 } = require("uuid");

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
  const { name, status } = req.body;
  if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof status !== "string") {
    res.status(400).json({ error: '"status" must be a string' });
  }

  const surveyId = uuidv4();

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

app.post("/survey-items", async function (req, res) {
  const { surveyItemId, surveyId, name } = req.body;
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

app.get("/survey", async function (req, res) {
  const params = {
    TableName: SURVEY_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    if (Items) {
      res.json(Items);
    } else {
      res.status(404).json({ error: "No surveys found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve surveys" });
  }
});

app.get("/survey/:surveyId", async function (req, res) {
  const params = {
    TableName: SURVEY_TABLE,
    Key: {
      surveyId: req.params.surveyId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { surveyId, name, status } = Item;
      res.json({ surveyId, name, status });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find survey with provided "surveyId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive survey" });
  }
});

app.get("/survey-items", async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      res.json(Items);
    } else {
      res.status(404).json({ error: "No survey items found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve survey items" });
  }
});

app.get("/survey-items/:surveyId", async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Key: {
      surveyId: req.params.surveyId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { surveyId, name, status } = Item;
      res.json({ surveyId, name, status });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "surveyId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive survey" });
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
