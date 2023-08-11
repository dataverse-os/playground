import { createContext, useContext } from "react";

import { PlaygroundActionType, PlaygroundContextType } from "@/types";

export const PlaygroundContext = createContext<PlaygroundContextType>(
  {} as PlaygroundContextType,
);

export const usePlaygroundStore = () => {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw "PlaygroundContext undefined";
  }

  const { state, dispatch } = context;

  const newBrowserStorage = (pkh: string) => {
    dispatch({
      type: PlaygroundActionType.NewBrowserStorage,
      payload: pkh,
    });
  };

  const setSortedStreamIds = (streamIds: string[]) => {
    dispatch({
      type: PlaygroundActionType.SetSortedStreamIds,
      payload: streamIds,
    });
  };

  const setIsDataverseExtension = (value: boolean) => {
    dispatch({
      type: PlaygroundActionType.SetIsDataverseExtension,
      payload: value,
    });
  };

  const setNoExtensionModalVisible = (value: boolean) => {
    dispatch({
      type: PlaygroundActionType.SetNoExtensionModalVisible,
      payload: value,
    });
  };

  const setIsConnecting = (value: boolean) => {
    dispatch({
      type: PlaygroundActionType.SetIsConnecting,
      payload: value,
    });
  };

  return {
    ...state,
    newBrowserStorage,
    setIsDataverseExtension,
    setSortedStreamIds,
    setNoExtensionModalVisible,
    setIsConnecting,
  };
};
