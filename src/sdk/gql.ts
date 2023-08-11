import { GraphQLClient } from "graphql-request";

export const gqlClient = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {},
);
