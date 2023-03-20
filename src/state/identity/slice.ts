import { installDataverseMessage } from "@/components/BaseComponents/Message";
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

interface Props {
  did: string;
  isConnectingIdentity: boolean;
}

const initialState: Props = {
  did: "",
  isConnectingIdentity: false,
};

export const connectIdentity = createAsyncThunk(
  "identity/connectIdentity",
  async (undefined, { dispatch }) => {
    const rootStore = await import("@/state/store");
    const { isConnectingIdentity } =
      rootStore.default.store.getState().identity;

    if (!(await detectDataverseExtension())) {
      installDataverseMessage();
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
