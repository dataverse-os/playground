import {
  Apps,
  Browser,
  ModelNames,
  RuntimeConnector,
} from "@dataverse/runtime-connector";

export let runtimeConnector: RuntimeConnector = new RuntimeConnector(Browser);
export const appName = Apps.dTwitter;
export const modelName = ModelNames.post;
export const modelNames = [ModelNames.post];
export const appVersion = "0.0.1";
