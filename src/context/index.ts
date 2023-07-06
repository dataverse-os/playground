import { Extension, DataverseConnector } from "@dataverse/dataverse-connector";
import { createContext } from "react";
import { Model, Output } from "../types";
import { getOutput, getPostModel, getIndexFilesModel } from "../utils";

interface ContextType {
  dataverseConnector: DataverseConnector;
  appVersion: string;
  postModel: Model;
  indexFilesModel: Model;
  output: Output;
}

export const Context = createContext<ContextType>({} as ContextType);

const dataverseConnector = new DataverseConnector(Extension);
const appVersion = "0.0.1";
const postModel = getPostModel();
const indexFilesModel = getIndexFilesModel();
const output = getOutput();

export const contextStore = {
  dataverseConnector,
  appVersion,
  postModel,
  indexFilesModel,
  output,
};
