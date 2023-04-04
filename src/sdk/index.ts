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
  "kjzl6hvfrbw6c7ft23trwmoox36eo7mnxlsj1dad2574bjm6c6fon8pmoqhp7br";
export const indexFileModelId =
  "kjzl6hvfrbw6c97oiirbdgv4jjwp5oxegb977dlpz1dktsqkbfne6agfd5ow0i0";

export const client = new GraphQLClient(
  `${process.env.DATAVERSE_ENDPOINT}/graphql`,
  {}
);

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();
