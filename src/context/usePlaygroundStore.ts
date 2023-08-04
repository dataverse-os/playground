import { PlaygroundActionType, PlaygroundContextType } from "@/types";
import { createContext, useContext } from "react";
import { initialState } from "./state";

export const PlaygroundContext = createContext<PlaygroundContextType>({
  state: initialState,
  dispatch: () => {},
});

export const usePlaygroundStore = () => {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw "PlaygroundContext undefined";
  }

  const { state, dispatch } = context;
  
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

  return {
    playgroundState: state,
    setIsDataverseExtension,
    setSortedStreamIds,
    setNoExtensionModalVisible
  };
};
