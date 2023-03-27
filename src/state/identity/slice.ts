import {
  connectIdentity as _connectIdentity,
  connectWallet,
  getCurrentDID,
} from "@/sdk/identity";
import {
  detectDataverseExtension,
  detectExtension,
} from "@/utils/checkIsExtensionInjected";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { noExtensionSlice } from "../noExtension/slice";

interface Props {
  did: string;
  isConnectingIdentity: boolean;
  isDataverseExtension: boolean;
}

const initialState: Props = {
  did: "",
  isConnectingIdentity: false,
  isDataverseExtension: true,
};

export const connectIdentity = createAsyncThunk(
  "identity/connectIdentity",
  async (undefined, { dispatch }) => {
    const rootStore = await import("@/state/store");
    const { isConnectingIdentity } =
      rootStore.default.store.getState().identity;

    if (!(await detectDataverseExtension())) {
      // installDataverseMessage();
      dispatch(noExtensionSlice.actions.setIsDataverseExtension(false));
      dispatch(noExtensionSlice.actions.setModalVisible(true));
    } else {
      dispatch(noExtensionSlice.actions.setIsDataverseExtension(true));
    }

    const did = await getCurrentDID();
    if (did) {
      await connectWallet();
      return did;
    }
    if (isConnectingIdentity) {
      return;
    }

    dispatch(identitySlice.actions.setIsConnectingIdentity(true));
    try {
      const did = await _connectIdentity();
      dispatch(identitySlice.actions.setIsConnectingIdentity(false));
      return did;
    } catch (error) {
      dispatch(identitySlice.actions.setIsConnectingIdentity(false));
      throw error;
    }
  }
);

export const identitySlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setIsConnectingIdentity: (state, action: PayloadAction<boolean>) => {
      state.isConnectingIdentity = action.payload;
    },
    setIsDataverseExtension: (state, action: PayloadAction<boolean>) => {
      state.isDataverseExtension = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectIdentity.fulfilled, (state, action) => {
      if (action.payload) {
        state.did = action.payload;
      }
    });
  },
});

export default identitySlice.reducer;
