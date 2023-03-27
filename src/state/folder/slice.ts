import { readMyPosts } from "@/sdk/folder";
import { CustomMirror, CustomMirrors } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { decryptPost, getDatatokenInfo } from "../post/slice";

interface Props {
  posts: CustomMirrors;
  currentMirror?: CustomMirror;
}

const initialState: Props = {
  posts: [],
  currentMirror: undefined,
};

export const displayMyPosts = createAsyncThunk(
  "folder/readMyPosts",
  async (did: string) => {
    const posts = await readMyPosts(did);
    return posts;
  }
);

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setCurrentMirror: (
      state,
      action: PayloadAction<CustomMirror | undefined>
    ) => {
      state.currentMirror = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(displayMyPosts.fulfilled, (state, action) => {
      state.posts = action.payload as CustomMirrors;
    });

    // //monetizeFileListener
    // builder.addCase(monetizeFile.pending, (state, action) => {
    //   state.posts.find((mirror) => {
    //     if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
    //       mirror.mirrorFile = {
    //         ...action.meta.arg.mirrorFile,
    //         isMonetizing: true,
    //       };
    //     }
    //   });
    // });
    // builder.addCase(monetizeFile.fulfilled, (state, action) => {
    //   console.log({ payload: action.payload });
    //   state.posts.find((mirror) => {
    //     if (mirror.mirrorId === action.payload?.indexFileId) {
    //       mirror.mirrorFile = {
    //         ...action.payload,
    //         isMonetizing: false,
    //         isMonetizedSuccessfully: true,
    //       };
    //     }
    //   });
    // });
    // builder.addCase(monetizeFile.rejected, (state, action) => {
    //   state.posts.find((mirror) => {
    //     if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
    //       mirror.mirrorFile = {
    //         ...action.meta.arg.mirrorFile,
    //         isMonetizing: false,
    //         isMonetizedSuccessfully: false,
    //       };
    //     }
    //   });
    // });
  },
});

export default folderSlice.reducer;
