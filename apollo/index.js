import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

async function getAllSurvey() {
  const response = await axios
    .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey")
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
  return response;
}

async function getSurveyById(surveyId) {
  const response = await axios
    .get(
      `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey/${surveyId}`
    )
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
  return response;
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

async function getSurveyItemsBySurveyId(surveyId) {
  const response = await axios
    .get(
      `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-Items/survey/${surveyId}`
    )
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });

  const msg = response.description;

  await axios
    .post(`http://localhost:3000/addSurveyItem`, {
      msg: msg,
    })
    .then(() => {
      console.log(msg);
    })
    .catch((erro) => {
      console.log("Error to send post request:", erro);
    });

  return response;
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
      votes: String
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
      surveyById(surveyId: String): Survey
      surveyItemsBySurveyId(surveyId: String): [SurveyItems]
    }

    type Mutation {
        addSurvey(surveyId: String, name: String, status: String): Survey
        deleteSurvey(surveyId: String): Survey
        updateSurvey(surveyId: String, name: String, status: String): Survey

        addSurveyItems(surveyItemId: String, description: String, surveyId: String, votes: String): SurveyItems
        deleteSurveyItems(surveyItemId: String): SurveyItems
        updateSurveyItems(surveyItemId: String, description: String, surveyId: String, votes: String): SurveyItems

        addPollItems(pollItemId: String, surveyItemId: String, description: String, surveyId: String): PollItems
        deletePollItems(pollItemId: String): PollItems
        updatePollItems(pollItemId: String, surveyItemId: String, description: String, surveyId: String): PollItems
    }
    `;

const resolvers = {
  Query: {
    survey: async () => await getAllSurvey(),
    survey_items: async () => await getAllSurveyItems(),
    poll_items: async () => await getAllPollItems(),

    surveyById: async (_, { surveyId }) => await getSurveyById(surveyId),
    surveyItemsBySurveyId: async (_, { surveyId }) =>
      await getSurveyItemsBySurveyId(surveyId),
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

        // const msg = response.name;

        // await axios
        //   .post(`http://localhost:3000/newSurvey`, {
        //     msg: msg,
        //   })
        //   .then(() => {
        //     console.log(msg);
        //   })
        //   .catch((erro) => {
        //     console.log("Error to send post request:", erro);
        //   });

        return response.data;
      } catch (error) {
        throw new Error("Failed to add survey");
      }
    },

    updateSurvey: async (_, { name, status, surveyId }) => {
      try {
        const response = await axios.put(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey/${surveyId}`,
          {
            name: name,
            status: status,
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao atualizar a enquete");
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

    addSurveyItems: async (_, { description, surveyId, votes }) => {
      try {
        const response = await axios.post(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-items`,
          {
            description: description,
            surveyId: surveyId,
            votes: votes,
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao adicionar a enquete");
      }
    },

    updateSurveyItems: async (
      _,
      { description, surveyId, votes, surveyItemId }
    ) => {
      try {
        const response = await axios.put(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-items/${surveyItemId}`,
          {
            description: description,
            surveyId: surveyId,
            votes: votes,
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao atualizar a enquete");
      }
    },

    deleteSurveyItems: async (_, { surveyItemId }) => {
      try {
        const response = await axios.delete(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-items/${surveyItemId}`
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao excluir o item da enquete");
      }
    },

    addPollItems: async (_, { surveyItemId, description, surveyId }) => {
      try {
        const response = await axios.post(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/poll-items`,
          {
            surveyItemId: surveyItemId,
            description: description,
            surveyId: surveyId,
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao adicionar uma votação para a enquete");
      }
    },

    updatePollItems: async (
      _,
      { surveyItemId, description, surveyId, pollItemId }
    ) => {
      try {
        const response = await axios.put(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/poll-items/${pollItemId}`,
          {
            surveyItemId: surveyItemId,
            description: description,
            surveyId: surveyId,
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao atualizar a votação da enquete");
      }
    },

    deletePollItems: async (_, { pollItemId }) => {
      try {
        const response = await axios.delete(
          `https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/poll-items/${pollItemId}`
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao excluir a votação da enquete");
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: 4000 });

console.log(`Server ready at ${url}`);
