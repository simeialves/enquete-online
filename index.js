const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const SURVEY_TABLE = process.env.SURVEY_TABLE;
const SURVEY_ITEMS_TABLE = process.env.SURVEY_ITEMS_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4: uuidv4 } = require("uuid");

app.use(express.json());

//#region SURVEY
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
    res
      .status(500)
      .json({ error: "Could not retrieve surveys", message: error.message });
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
    res
      .status(500)
      .json({ error: "Could not retreive survey", message: error.message });
  }
});

app.put("/survey/:surveyId", async function (req, res) {
  const { surveyId } = req.params;
  const { name, status } = req.body;

  if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
    return;
  } else if (typeof status !== "string") {
    res.status(400).json({ error: '"status" must be a string' });
    return;
  }

  const params = {
    TableName: SURVEY_TABLE,
    Key: {
      surveyId: surveyId,
    },
    UpdateExpression: "SET #name = :name, #status = :status",
    ExpressionAttributeNames: {
      "#name": "name",
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":status": status,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDbClient.send(new UpdateCommand(params));
    res.json(result.Attributes);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not update survey", message: error.message });
  }
});

app.delete("/survey/:surveyId", async function (req, res) {
  const params = {
    TableName: SURVEY_TABLE,
    Key: {
      surveyId: req.params.surveyId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      await dynamoDbClient.send(new DeleteCommand(params));
      res.status(200).json({ message: "Survey deleted successfully" });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find survey with provided "surveyId"' });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not delete survey", message: error.message });
  }
});

//#endregion

//#region SURVEY-ITEMS
app.post("/survey-items", async function (req, res) {
  const { surveyId, description, votes } = req.body;
  if (typeof surveyId !== "string") {
    res.status(400).json({ error: '"surveyId" must be a string' });
  } else if (typeof description !== "string") {
    res.status(400).json({ error: '"description" must be a string' });
  } else if (typeof votes !== "string") {
    res.status(400).json({ error: '"votes" must be a string' });
  }

  const surveyItemId = uuidv4();

  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Item: {
      surveyItemId: surveyItemId,
      surveyId: surveyId,
      description: description,
      votes: votes,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ surveyItemId, surveyId, description, votes });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not create survey", message: error.message });
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
    res.status(500).json({
      error: "Could not retrieve survey items",
      message: error.message,
    });
  }
});

app.get("/survey-items/:surveyItemId", async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Key: {
      surveyItemId: req.params.surveyItemId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { surveyItemId, surveyId, description, votes } = Item;
      res.json({ surveyItemId, surveyId, description, votes });
    } else {
      res.status(404).json({
        error: 'Could not find survey-items with provided "surveyItemId"',
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not retreive survey", message: error.message });
  }
});

app.get("/survey-items-by-surveyId/:surveyItemId", async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Key: {
      surveyItemId: req.params.surveyItemId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { surveyItemId, surveyId, description, votes } = Item;
      res.json({ surveyItemId, surveyId, description, votes });
    } else {
      res.status(404).json({
        error: 'Could not find survey-items with provided "surveyItemId"',
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not retreive survey", message: error.message });
  }
});

app.put("/survey-items/:surveyItemId", async function (req, res) {
  const { surveyItemId } = req.params;
  const { surveyId, description, votes } = req.body;

  if (typeof surveyId !== "string") {
    res.status(400).json({ error: '"surveyId" must be a string' });
  } else if (typeof description !== "string") {
    res.status(400).json({ error: '"description" must be a string' });
  } else if (typeof votes !== "string") {
    res.status(400).json({ error: '"votes" must be a string' });
  }

  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Key: {
      surveyItemId: surveyItemId,
    },
    UpdateExpression:
      "SET #surveyId = :surveyId, #description = :description, #votes = :votes",
    ExpressionAttributeNames: {
      "#surveyId": "surveyId",
      "#description": "description",
      "#votes": "votes",
    },
    ExpressionAttributeValues: {
      ":surveyId": surveyId,
      ":description": description,
      ":votes": votes,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDbClient.send(new UpdateCommand(params));
    res.json(result.Attributes);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not update surveyItems", message: error.message });
  }
});

app.delete("/survey-items/:surveyItemId", async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    Key: {
      surveyItemId: req.params.surveyItemId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      await dynamoDbClient.send(new DeleteCommand(params));
      res.status(200).json({ message: "SurveyItems deleted successfully" });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find survey with provided "surveyItemId"' });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not delete surveyItem", message: error.message });
  }
});
//#endregion

app.get("/ping", async function (req, res) {
  res.json({ message: "pong" });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
