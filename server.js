require("dotenv").config();
import { ApolloServer, gql } from "apollo-server-express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import express from "express";
import logger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils.js";
import pubsub from "./pubsub";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  });
  console.log(pubsub);
  await apollo.start();

  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress());
  apollo.install;

  app.use("/static", express.static("uploads"));
  apollo.applyMiddleware({ app });

  await new Promise((func) => app.listen({ port: PORT }, func));
  console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
};
startServer();
