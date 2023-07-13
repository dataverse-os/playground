import { Extension, CoreConnector } from "@dataverse/core-connector";
import { createContext } from "react";
import { Model, Output } from "../types";
import { getOutput, getPostModel, getIndexFilesModel } from "../utils";

interface ContextType {
  coreConnector: CoreConnector;
  appVersion: string;
  postModel: Model;
  indexFilesModel: Model;
  output: Output;
}

export const Context = createContext<ContextType>({} as ContextType);

const coreConnector = new CoreConnector(Extension);
const appVersion = "0.0.1";
const postModel = getPostModel();
const indexFilesModel = getIndexFilesModel();
const output = getOutput();

export const contextStore = {
  coreConnector,
  appVersion,
  postModel,
  indexFilesModel,
  output,
};
