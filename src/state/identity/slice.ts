import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
});

export default identitySlice.reducer;
