import { PostType } from "@/types";
import { Currency } from "@dataverse/dataverse-connector";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  modalVisible: boolean;
  settings: Settings;
  needEncrypt?: boolean;
}

interface Settings {
  postType: PostType;
  currency?: Currency;
  amount?: number;
  collectLimit?: number;
}

const initialState: Props = {
  modalVisible: false,
  settings: {
    postType: PostType.Public,
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
      state.settings = action.payload;
    },
    setNeedEncrypt: (state, action: PayloadAction<boolean>) => {
      state.needEncrypt = action.payload;
    },
  },
});

export default privacySettingsSlice.reducer;
