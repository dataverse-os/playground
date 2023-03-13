import { PostType } from "@/types";
import { Currency } from "@dataverse/runtime-connector";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  modalVisible: boolean;
  settings: Settings;
}

interface Settings {
  type: PostType;
  currency?: Currency;
  amount?: number;
  collectLimit?: number;
}

const initialState: Props = {
  modalVisible: false,
  settings: {
    type: PostType.Private,
    currency: undefined,
    amount: undefined,
    collectLimit: undefined,
  },
};

export const privacySettingsSlice = createSlice({
  name: "privacySettings",
  initialState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<boolean>) => {
      state.modalVisible = action.payload;
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      console.log(action.payload)
      state.settings = action.payload;
    },
  },
});

export default privacySettingsSlice.reducer;
