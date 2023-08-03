import { createContext } from "react";
import { ModelParser, Output, Model } from "@dataverse/model-parser";
import app from "../../output/app.json"

interface ContextType {
  appVersion: string;
  modelParser: ModelParser;
}

export const Context = createContext<ContextType>({} as ContextType);

const appVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);

export const contextStore = {
  appVersion,
  modelParser,
};
