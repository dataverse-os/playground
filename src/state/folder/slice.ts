import { readMyDefaultFolder } from "@/sdk/folder";
import { CustomFolder } from "@/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Props {
  folder?: CustomFolder;
}

const initialState: Props = {
  folder: undefined,
};

export const displayDefaultFolder = createAsyncThunk(
  "folder/readMyDefaultFolder",
  async (did: string) => {
    const res = await readMyDefaultFolder(did);
    return res;
  }
);

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(displayDefaultFolder.fulfilled, (state, action) => {
      state.folder = action.payload;
    });
  },
});

export default folderSlice.reducer;
