import { connectIdentity as _connectIdentity } from "@/sdk/identity";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  modalVisible: boolean;
  isDataverseExtension: boolean;
}

const initialState: Props = {
  modalVisible: false,
  isDataverseExtension: false,
};

export const noExtensionSlice = createSlice({
  name: "noExtension",
  initialState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<boolean>) => {
      state.modalVisible = action.payload;
    },
    setIsDataverseExtension: (state, action: PayloadAction<boolean>) => {
      state.isDataverseExtension = action.payload;
    },
  },
});

export default noExtensionSlice.reducer;
