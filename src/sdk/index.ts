import {
  Apps,
  Extension,
  ModelNames,
  RuntimeConnector,
} from "@dataverse/runtime-connector";
import { GraphQLClient } from "graphql-request";
import { Ceramic } from "./ceramic";

export const runtimeConnector: RuntimeConnector = new RuntimeConnector(
  Extension
);
export const appName = Apps.Playground;
export const modelName = ModelNames.post;
export const modelNames = [ModelNames.post];
export const appVersion = "0.0.2";
export const oldAppVersion = "0.0.1";
export const postModelId =
  "kjzl6hvfrbw6cb1jfm9wiuqelthhvv3hzpb2urkbcwdum1g0ao2qygdj0qdqn5g";
export const indexFileModelId =
  "kjzl6hvfrbw6c763ubdhowzao0m4yp84cxzbfnlh4hdi5alqo4yrebmc0qpjdi5";

export const client = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {}
);

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();
