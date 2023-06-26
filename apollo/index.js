import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

const URL_SERVERLESS = "https://kofgvsu30l.execute-api.us-east-1.amazonaws.com";
//const URL_SOCKET_IO = "http://localhost:3000";
const URL_SOCKET_IO = "http://enquete-online.simeialves.com.br";

async function getAllSurvey() {
  const response = await axios
    .get(`${URL_SERVERLESS}/survey`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
  return response;
}

async function getSurveyById(surveyId) {
  const response = await axios
    .get(`${URL_SERVERLESS}/survey/${surveyId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
  return response;
}

async function getAllSurveyItems() {
  return await axios
    .get(`${URL_SERVERLESS}/survey-items`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
}

async function getSurveyItemsBySurveyId(surveyId) {
  const response = await axios
    .get(`${URL_SERVERLESS}/survey-Items/survey/${surveyId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });

  return response;
}

async function getAllPollItems() {
  return await axios
    .get(`${URL_SERVERLESS}/poll-items`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });
}

async function getPollItemsBySurveyItemId(surveyItemId) {
  const response = await axios
    .get(`${URL_SERVERLESS}/poll-items/surveyItems/${surveyItemId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Erro ao buscar as enquetes:", error);
      return [];
    });

  return response.length;
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

        addPollItems(pollItemId: String, surveyItemId: String): PollItems
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
        const response = await axios.post(`${URL_SERVERLESS}/survey`, {
          name: name,
          status: status,
        });

        const msg = response.data.name;

        axios
          .post(`${URL_SOCKET_IO}/add-survey`, {
            msg: msg,
          })
          .then(() => {
            console.log(msg);
          })
          .catch((erro) => {
            console.log("Error to send post request:", erro);
          });

        return response.data;
      } catch (error) {
        throw new Error("Failed to add survey");
      }
    },

    // updateSurvey: async (_, { name, status, surveyId }) => {
    //   try {
    //     const response = await axios.put(
    //       `${URL_SERVERLESS}/survey/${surveyId}`,
    //       {
    //         name: name,
    //         status: status,
    //       }
    //     );

    //     const msg = response.data.name;

    //     if (status == 1) {
    //       const response = await getSurveyItemsBySurveyId(surveyId);

    //       var resultado = "";

    //       response
    //         .forEach(async (item) => {
    //           var resultadoItem = "";
    //           const qtd = await getPollItemsBySurveyItemId(item.surveyItemId);

    //           resultadoItem +=
    //             "Opção: " +
    //             item.description +
    //             " - Qtd. de votos: " +
    //             qtd +
    //             ". ";
    //           resultado += resultadoItem;
    //           console.log(resultado);
    //         })
    //         .then(() => {
    //           console.log("entrou");
    //           axios
    //             .post(`${URL_SOCKET_IO}/update-survey`, {
    //               msg: resultado,
    //             })
    //             .then((result) => {
    //               console.log("teste");
    //             })
    //             .catch((erro) => {
    //               console.log("Error to send post request:", erro);
    //             });
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     }

    //     return response.data;
    //   } catch (error) {
    //     throw new Error("Falha ao atualizar a enquete");
    //   }
    // },

    updateSurvey: async (_, { name, status, surveyId }) => {
      try {
        const response = await axios.put(
          `${URL_SERVERLESS}/survey/${surveyId}`,
          {
            name: name,
            status: status,
          }
        );

        const nameSurvey = response.data.name;

        if (status == 1) {
          const surveyItems = await getSurveyItemsBySurveyId(surveyId);

          var resultado = nameSurvey;

          for (const item of surveyItems) {
            var resultadoItem = "";
            const qtd = await getPollItemsBySurveyItemId(item.surveyItemId);

            resultadoItem +=
              "\r\nOpção: " +
              item.description +
              " - Qtd. de votos: " +
              qtd +
              ". ";
            resultado += "\r\n" + resultadoItem;
          }

          try {
            await axios.post(`${URL_SOCKET_IO}/update-survey`, {
              msg: resultado,
            });
          } catch (error) {
            console.log("Error to send post request:", error);
          }
        }

        return response.data;
      } catch (error) {
        throw new Error("Falha ao atualizar a enquete");
      }
    },

    deleteSurvey: async (_, { surveyId }) => {
      try {
        const response = await axios.delete(
          `${URL_SERVERLESS}/survey/${surveyId}`
        );

        return response.data;
      } catch (error) {
        throw new Error("Falha ao excluir a enquete");
      }
    },

    addSurveyItems: async (_, { description, surveyId, votes }) => {
      try {
        const response = await axios.post(`${URL_SERVERLESS}/survey-items`, {
          description: description,
          surveyId: surveyId,
          votes: votes,
        });

        const msg = response.data.description;

        axios
          .post(`${URL_SOCKET_IO}/add-survey-item`, {
            msg: msg,
          })
          .then(() => {
            console.log(msg);
          })
          .catch((erro) => {
            console.log("Error to send post request:", erro);
          });

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
          `${URL_SERVERLESS}/survey-items/${surveyItemId}`,
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
          `${URL_SERVERLESS}/survey-items/${surveyItemId}`
        );
        return response.data;
      } catch (error) {
        throw new Error("Falha ao excluir o item da enquete");
      }
    },

    addPollItems: async (_, { surveyItemId }) => {
      try {
        const response = await axios.post(`${URL_SERVERLESS}/poll-items`, {
          surveyItemId: surveyItemId,
        });

        const result = await axios
          .get(`${URL_SERVERLESS}/survey-items/${surveyItemId}`)
          .then((response) => response.data)
          .catch((error) => {
            console.log("Erro ao buscar as enquetes:", error);
            return [];
          });

        const pollItems = await axios
          .get(`${URL_SERVERLESS}/poll-items/surveyItems/${surveyItemId}`)
          .then((response) => response.data)
          .catch((error) => {
            console.log("Erro ao buscar poll items:", error);
            return [];
          });

        const count = pollItems.length;

        let description = result.description;

        description += " - Quantidade parcial: " + count;

        axios
          .post(`${URL_SOCKET_IO}/add-poll-item`, {
            msg: description,
          })
          .then(() => {})
          .catch((erro) => {
            console.log("Error to send post request:", erro);
          });

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
          `${URL_SERVERLESS}/poll-items/${pollItemId}`,
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
          `${URL_SERVERLESS}/poll-items/${pollItemId}`
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
