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
  "kjzl6hvfrbw6c8qhw53xw7f0x7mldpfzi2e2emkjs98m5fgkfbdnrjuui3xf7qp";
export const indexFileModelId =
  "kjzl6hvfrbw6c56g12gbdlb0tgep7l4xaib2z09vkrlwwrptd58qc668o2sbcyz";

export const client = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {}
);

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();
