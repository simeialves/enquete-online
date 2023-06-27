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

const POLL_ITEMS_TABLE = process.env.POLL_ITEMS_TABLE;

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const { v4: uuidv4 } = require("uuid");

app.use(express.json());
//#region CREATE
module.exports.createPollItems = async function (req, res) {
  const { surveyItemId } = req.body;
  if (typeof surveyItemId !== "string") {
    res.status(400).json({ error: '"surveyItemId" must be a string' });
  }

  const pollItemId = uuidv4();

  const params = {
    TableName: POLL_ITEMS_TABLE,
    Item: {
      pollItemId: pollItemId,
      surveyItemId: surveyItemId,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({
      pollItemId,
      surveyItemId,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not create pollItem", message: error.message });
  }
};
//#endregion

//#region READ
module.exports.getPollItems = async function (req, res) {
  const params = {
    TableName: POLL_ITEMS_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      res.json(Items);
    } else {
      res.status(404).json({ error: "No pollItems items found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not retrieve poll items",
      message: error.message,
    });
  }
};
module.exports.getPollItemsById = async function (req, res) {
  const params = {
    TableName: POLL_ITEMS_TABLE,
    Key: {
      pollItemId: req.params.pollItemId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { pollItemId, surveyItemId, description, surveyId } = Item;
      res.json({ pollItemId, surveyItemId, description, surveyId });
    } else {
      res.status(404).json({
        error: 'Could not find survey-items with provided "pollItemId"',
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not retreive pollItem", message: error.message });
  }
};
module.exports.getPollItemsBySurveyItemId = async function (req, res) {
  const params = {
    TableName: POLL_ITEMS_TABLE,
    FilterExpression: "surveyItemId = :surveyItemIdValue",
    ExpressionAttributeValues: {
      ":surveyItemIdValue": req.params.surveyItemId,
    },
  };

  try {
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    if (Items && Items.length > 0) {
      const surveyItems = Items.map((item) => {
        const { pollItemId, surveyItemId } = item;
        return { pollItemId, surveyItemId };
      });
      res.json(surveyItems);
    } else {
      res.status(404).json({
        error: 'Could not find poll-items with provided "surveyItemId"',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Could not retrieve poll items",
      message: error.message,
    });
  }
};
//#endregion

//#region UPDATE
module.exports.updatePollItems = async function (req, res) {
  const { pollItemId } = req.params;
  const { surveyId, surveyItemId, description } = req.body;

  if (typeof surveyId !== "string") {
    res.status(400).json({ error: '"surveyId" must be a string' });
  } else if (typeof surveyItemId !== "string") {
    res.status(400).json({ error: '"surveyItemId" must be a string' });
  } else if (typeof description !== "string") {
    res.status(400).json({ error: '"description" must be a string' });
  }

  const params = {
    TableName: POLL_ITEMS_TABLE,
    Key: {
      pollItemId: pollItemId,
    },
    UpdateExpression:
      "SET #surveyId = :surveyId, #surveyItemId = :surveyItemId, #description = :description",
    ExpressionAttributeNames: {
      "#surveyId": "surveyId",
      "#surveyItemId": "surveyItemId",
      "#description": "description",
    },
    ExpressionAttributeValues: {
      ":surveyId": surveyId,
      ":surveyItemId": surveyItemId,
      ":description": description,
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
      .json({ error: "Could not update pollItems", message: error.message });
  }
};
//#endregion

//#region DELETE
module.exports.deletePollItems = async function (req, res) {
  const params = {
    TableName: POLL_ITEMS_TABLE,
    Key: {
      pollItemId: req.params.pollItemId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      await dynamoDbClient.send(new DeleteCommand(params));
      res.status(200).json({ message: "PollItems deleted successfully" });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find pollItem with provided "pollItemId"' });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Could not delete pollItem", message: error.message });
  }
};
//#endregion
