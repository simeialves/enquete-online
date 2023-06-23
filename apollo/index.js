import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

async function getAllSurvey() {
  return await axios
    .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey")
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
}

async function getAllSurveyItems() {
  return await axios
    .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-items")
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
}

async function getAllPollItems() {
  return await axios
    .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/poll-items")
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
}

const typeDefs = `#graphql
   
    type Survey {
      surveyId: String
      name: String
      status: String
    }
    
    type SurveyItems {
      surveyItemId: String
      description: String
      surveyId: String
      vote: String
    }

    type PollItems{
      pollItemId: String
      surveyItemId: String
      description: String
      surveyId: String
    }

    type Query{
      survey: [Survey]
      survey_items: [SurveyItems]
      poll_items: [PollItems]
    }

    type Mutation {
        addSurvey(surveyId: String, name: String, status: String): Survey
        deleteSurvey(surveyId: String): Survey

        addSurveyItems(surveyItemId: String, description: String, surveyId: String, vote: String): SurveyItems
        deleteSurveyItems(surveyItemId: String): SurveyItems

        addPollItems(pollItemId: String, surveyItemId: String, description: String, surveyId: String): PollItems
        deletePollItems(pollItemId: String): PollItems                
    }
    `;

const resolvers = {
  Query: {
    survey: () => getAllSurvey(),
    survey_items: () => getAllSurveyItems(),
    poll_items: () => getAllPollItems(),
  },
  Mutation: {
    addSurvey: async (_, { name, status }) => {
      try {
        const response = await axios.post(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey`,
          {
            name: name,
            status: status,
          }
        );

        return response.data;
      } catch (error) {
        throw new Error("Failed to add survey");
      }
    },

    deleteSurvey: async (_, { surveyId }) => {
      try {
        const response = await axios.delete(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey/${surveyId}`
        );

        return response.data;
      } catch (error) {
        throw new Error("Falha ao excluir a enquete");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: 4000 });

console.log(`Server ready at ${url}`);
