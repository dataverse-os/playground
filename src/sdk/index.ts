import {
  Apps,
  Extension,
  ModelNames,
  RuntimeConnector,
} from "@dataverse/runtime-connector";

export let runtimeConnector: RuntimeConnector = new RuntimeConnector(Extension);
export const appName = Apps.dTwitter;
export const modelName = ModelNames.post;
export const modelNames = [ModelNames.post];
export const appVersion = "0.0.1";
