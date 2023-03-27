import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  modalVisible: boolean;
  profileId: string;
}

const initialState: Props = {
  modalVisible: false,
  profileId: "",
};

export const lensProfileSlice = createSlice({
  name: "lensProfile",
  initialState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<boolean>) => {
      state.modalVisible = action.payload;
    },
    setProfileId: (state, action: PayloadAction<string>) => {
      state.profileId = action.payload;
    },
  },
});

export default lensProfileSlice.reducer;
