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
export const slug = Apps.Playground;
export const modelName = `${slug.toLocaleLowerCase()}_post`;
export const modelNames = [modelName];
export const appVersion = "0.0.1";
export const postModelId =
  "kjzl6hvfrbw6c7cp6xafsa7ghxh1yfw4bsub1363ehrxhi999vlpxny9k69uoxz";
export const indexFileModelId =
  "kjzl6hvfrbw6c763ubdhowzao0m4yp84cxzbfnlh4hdi5alqo4yrebmc0qpjdi5";

export const client = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {}
);

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();
