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

const SURVEY_ITEMS_TABLE = process.env.SURVEY_ITEMS_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4: uuidv4 } = require("uuid");

app.use(express.json());
//#region CREATE
module.exports.createSurveyItems = async function (req, res) {
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
      .json({ error: "Could not create surveyItems", message: error.message });
  }
};
//#endregion

//#region READ
module.exports.getSurveyItems = async function (req, res) {
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
};
module.exports.getSurveyItemsById = async function (req, res) {
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
      .json({ error: "Could not retreive surveyItem", message: error.message });
  }
};
module.exports.getSurveyItemsBySurveyId = async function (req, res) {
  const params = {
    TableName: SURVEY_ITEMS_TABLE,
    FilterExpression: "surveyId = :surveyIdValue",
    ExpressionAttributeValues: {
      ":surveyIdValue": req.params.surveyId,
    },
  };

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      const surveyItems = Items.map((item) => {
        const { surveyItemId, surveyId, description, votes } = item;
        return { surveyItemId, surveyId, description, votes };
      });
      res.json(surveyItems);
    } else {
      res.status(404).json({
        error: 'Could not find survey-items with provided "surveyId"',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not retrieve survey items",
      message: error.message,
    });
  }
};
//#endregion

//#region UPDATE
module.exports.updateSurveyItems = async function (req, res) {
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
};
//#endregion

//#region DELETE
module.exports.deleteSurveyItems = async function (req, res) {
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
      res.status(404).json({
        error: 'Could not find surveyItem with provided "surveyItemId"',
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not delete surveyItem", message: error.message });
  }
};
//#endregion
