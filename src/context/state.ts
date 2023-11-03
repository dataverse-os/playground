import { ModelParser, Output } from "@dataverse/model-parser";

import app from "../../output/app.json";

import { PlaygroundActionType, PlaygroundStateType } from "@/types";
import { BrowserStorage } from "@/utils";

export const initialState: PlaygroundStateType = {
  modelVersion: "0.0.1",
  modelParser: new ModelParser(app as Output),
  browserStorage: new BrowserStorage(),
  sortedStreamIds: [],
  isDataverseExtension: undefined,
  isNoExtensionModalVisible: false,
  isConnecting: false,
};

export const reducer = (
  state: PlaygroundStateType,
  action: {
    type: PlaygroundActionType;
    payload: any;
  },
) => {
  const { type, payload } = action;

  switch (type) {
    case PlaygroundActionType.SetSortedStreamIds:
      return {
        ...state,
        sortedStreamIds: payload,
      };
    case PlaygroundActionType.SetIsDataverseExtension:
      return {
        ...state,
        isDataverseExtension: payload,
      };
    case PlaygroundActionType.SetNoExtensionModalVisible:
      return {
        ...state,
        isNoExtensionModalVisible: payload,
      };
    case PlaygroundActionType.SetIsConnecting:
      return {
        ...state,
        isConnecting: payload,
      };
  }
};
