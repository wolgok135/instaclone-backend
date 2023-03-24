require("dotenv").config();
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import { getUser } from "./users/users.utils";
import express from "express";
import logger from "morgan";
import client from "./client";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";
import { createServer } from "http";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        if (!ctx.connectionParams?.token) {
          return { loggedInUser: null };
        }
        const loggedInUser = await getUser(ctx.connectionParams?.token);
        return {
          loggedInUser,
        };
      },
      onConnect: async (ctx) => {
        console.log(ctx);
        if (!ctx.connectionParams?.token) {
          throw new Error("token is missing");
        }
        console.log("connected");
      },
      onDisconnect(ctx, code, reason) {
        console.log("Disconnected!");
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
          client,
        };
      }
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  app.use(graphqlUploadExpress(), logger("tiny"));
  server.applyMiddleware({ app });

  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
  });
};
startServer();
