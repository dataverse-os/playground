import { PostType } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  modalVisible: boolean;
  settings: Settings;
}

interface Settings {
  type: PostType.Private;
  currecy: undefined;
  price: undefined;
  supply: undefined;
}

const initialState: Props = {
  modalVisible: false,
  settings: {
    type: PostType.Private,
    currecy: undefined,
    price: undefined,
    supply: undefined,
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
  },
});

export default privacySettingsSlice.reducer;
