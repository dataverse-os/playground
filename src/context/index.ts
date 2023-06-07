import { Extension, RuntimeConnector } from "@dataverse/runtime-connector";
import { createContext } from "react";
import { Model, Output } from "../types";
import { getOutput, getPostModelFromOutput } from "../utils";

interface ContextType {
  runtimeConnector: RuntimeConnector;
  appVersion: string;
  postModel: Model;
  output: Output;
}

export const Context = createContext<ContextType>({} as ContextType);

const runtimeConnector = new RuntimeConnector(Extension);
const appVersion = "0.0.1";
const postModel = getPostModelFromOutput();
const output = getOutput();

export const contextStore = {
    runtimeConnector,
    appVersion,
    postModel,
    output
}