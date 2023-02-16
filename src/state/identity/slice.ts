import { connectIdentity as _connectIdentity } from "@/sdk/identity";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  // address: string;
  did: string;
}

const initialState: Props = {
  // address: "",
  did: "",
};

export const connectIdentity = createAsyncThunk(
  "identity/connectIdentity",
  async () => {
    const did = await _connectIdentity();
    return did;
  }
);

export const identitySlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(connectIdentity.fulfilled, (state, action) => {
      state.did = action.payload;
    });
  },
});

export default identitySlice.reducer;
