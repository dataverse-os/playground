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
  "kjzl6hvfrbw6c7jz14txdb1ee8frcwlaoo2vfxb21hovo9s0v87xye8fb08bft6";
export const indexFileModelId =
  "kjzl6hvfrbw6c8jhmo81mmre4b5gwhoi92uba1y3xx6lnnnxzxibth7yr9jkq0n";

export const client = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {}
);

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();
