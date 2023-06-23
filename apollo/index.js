import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

const books = [
  {
    id: "a",
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K Rowling",
  },
  {
    id: "b",
    title: "Jurassic Park",
    author: "Michael Crichton",
  },
];

const survey = await axios
  .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey")
  .then((response) => response.data)
  .catch((error) => {
    console.log("Erro ao buscar as enquetes:", error);
    return [];
  });

const survey_items = await axios
  .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/survey-items")
  .then((response) => response.data)
  .catch((error) => {
    console.log("Erro ao buscar as enquetes:", error);
    return [];
  });

const poll_items = await axios
  .get("https://kofgvsu30l.execute-api.us-east-1.amazonaws.com/poll-items")
  .then((response) => response.data)
  .catch((error) => {
    console.log("Erro ao buscar as enquetes:", error);
    return [];
  });

console.log(survey, survey_items, poll_items);

const typeDefs = `#graphql
    type Book {
        id: String
        title: String
        author: String
    }
    
    type Query{
        books: [Book]
    }

    type Mutation {
        addBook(id: String, title: String, author: String): Book
        deleteBook(id: String): Book
    }
    `;

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook: (_, { id, title, author }) => {
      const book = { id, title, author };
      books.push(book);
      return book;
    },
    deleteBook: (_, { id }) => {
      const book = books.find((book) => book.id === id);
      books.splice(books.indexOf(book), 1);
      return book;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: 4000 });

console.log(`Server ready at ${url}`);
