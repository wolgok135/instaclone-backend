require("dotenv").config();
import { ApolloServer, gql } from "apollo-server";
import schema from "./schema";

const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`Server is running at http://localhost:${PORT}/`));
