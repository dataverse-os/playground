// import {
//   checkIsCurrentDIDValid,
//   connectIdentity as _connectIdentity,
//   getCurrentDID,
//   getCurrentWallet,
//   selectWallet,
// } from "@/sdk/identity";
// import {
//   detectDataverseExtension,
//   detectExtension,
// } from "@/utils/checkIsExtensionInjected";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { noExtensionSlice } from "../noExtension/slice";
// import { RootState } from "../store";
// import { getNamespaceAndReferenceFromDID } from "@/utils/didAndAddress";

interface Props {
  pkh: string;
  isConnectingIdentity: boolean;
  isDataverseExtension: boolean;
}

const initialState: Props = {
  pkh: "",
  isConnectingIdentity: false,
  isDataverseExtension: true,
};

// export const connectIdentity = createAsyncThunk(
//   "identity/connectIdentity",
//   async (undefined, { dispatch, getState }) => {
//     // const rootStore = await import("@/state/store");
//     // const { isConnectingIdentity } =
//     //   rootStore.default.store.getState().identity;
//     const { isConnectingIdentity ,did} = (getState() as RootState).identity;

//     if (!(await detectDataverseExtension())) {
//       // installDataverseMessage();
//       dispatch(noExtensionSlice.actions.setIsDataverseExtension(false));
//       dispatch(noExtensionSlice.actions.setModalVisible(true));
//     } else {
//       dispatch(noExtensionSlice.actions.setIsDataverseExtension(true));
//     }
    
//     if (did || isConnectingIdentity) {
//       return;
//     }

//     dispatch(identitySlice.actions.setIsConnectingIdentity(true));
//     try {
//       const did = await _connectIdentity();
//       dispatch(identitySlice.actions.setIsConnectingIdentity(false));
//       return did;
//     } catch (error) {
//       dispatch(identitySlice.actions.setIsConnectingIdentity(false));
//       throw error;
//     }
//   }
// );

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
    setPkh: (state, action: PayloadAction<string>) => {
      state.pkh = action.payload;
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(connectIdentity.fulfilled, (state, action) => {
  //     if (action.payload) {
  //       state.did = action.payload;
  //     }
  //   });
  // },
});

export default identitySlice.reducer;
