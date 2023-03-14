import {
  Apps,
  Extension,
  ModelNames,
  RuntimeConnector,
} from "@dataverse/runtime-connector";
import {  GraphQLClient } from "graphql-request";

export const runtimeConnector: RuntimeConnector = new RuntimeConnector(
  Extension
);
export const appName = Apps.Playground;
export const modelName = ModelNames.post;
export const modelNames = [ModelNames.post];
export const appVersion = "0.0.2";
export const oldAppVersion = "0.0.1";
const ENDPOINT = process.env.DATAVERSE_ENDPOINT;

export const client = new GraphQLClient(`${ENDPOINT}/graphql`, {});