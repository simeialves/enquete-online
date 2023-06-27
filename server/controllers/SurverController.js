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

const app = express();

const SURVEY_TABLE = process.env.SURVEY_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4: uuidv4 } = require("uuid");

app.use(express.json());
//#region CREATE
module.exports.createSurvey = async function (req, res) {
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
};
//#endregion

//#region READ
module.exports.getSurvey = async function (req, res) {
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
};

module.exports.getSurveyById = async function (req, res) {
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
};
//#endregion

//#region UPDATE
module.exports.updateSurvey = async function (req, res) {
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
};
//#endregion

//#region DELETE
module.exports.deleteSurvey = async function (req, res) {
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
};
//#endregion
