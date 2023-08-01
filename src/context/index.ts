import { DataverseConnector } from "@dataverse/dataverse-connector";
import { createContext } from "react";
import { getOutput, getPostModel, getIndexFilesModel } from "../utils";
import { ModelParser, Output, Model } from "@dataverse/model-parser";
import app from "../../output/app.json"

interface ContextType {
  dataverseConnector: DataverseConnector;
  appVersion: string;
  postModel: Model;
  indexFilesModel: Model;
  modelParser: ModelParser;
}

export const Context = createContext<ContextType>({} as ContextType);

const dataverseConnector = new DataverseConnector();
const appVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);
const postModel = modelParser.getModelByName("post");
const indexFilesModel = modelParser.getModelByName("indexFiles");

export const contextStore = {
  dataverseConnector,
  appVersion,
  postModel,
  indexFilesModel,
  modelParser,
};
