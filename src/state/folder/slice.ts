import { readMyPosts } from "@/sdk/folder";
import { CustomMirror, CustomMirrors } from "@/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { decryptPost } from "../post/slice";
import { buyFile, monetizeFile } from "../file/slice";

interface Props {
  posts: CustomMirrors;
  currentMirror?: CustomMirror;
}

const initialState: Props = {
  posts: [],
  currentMirror: undefined,
};

export const displayDefaultFolder = createAsyncThunk(
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
    builder.addCase(displayDefaultFolder.fulfilled, (state, action) => {
      state.posts = action.payload as CustomMirrors;
    });

    //decryptPostListener
    builder.addCase(decryptPost.pending, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isDecrypting: true,
          };
        }
      });
    });
    builder.addCase(decryptPost.fulfilled, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.payload.indexFileId) {
          mirror.mirrorFile = {
            ...action.payload,
            isDecrypting: false,
            isDecryptedSuccessfully: true,
          };
        }
      });
    });
    builder.addCase(decryptPost.rejected, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isDecrypting: false,
            isDecryptedSuccessfully: false,
          };
        }
      });
      alert(action.error.message);
    });

    //monetizeFileListener
    builder.addCase(monetizeFile.pending, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isMonetizing: true,
          };
        }
      });
    });
    builder.addCase(monetizeFile.fulfilled, (state, action) => {
      console.log({ payload: action.payload });
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.payload?.indexFileId) {
          mirror.mirrorFile = {
            ...action.payload,
            isMonetizing: false,
            isMonetizedSuccessfully: true,
          };
        }
      });
    });
    builder.addCase(monetizeFile.rejected, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isMonetizing: false,
            isMonetizedSuccessfully: false,
          };
        }
      });
      alert(action.error.message);
    });

    //buyFileListener
    builder.addCase(buyFile.pending, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isBuying: true,
          };
        }
      });
    });
    builder.addCase(buyFile.fulfilled, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.payload,
            isBuying: false,
            isBoughtSuccessfully: true,
          };
        }
      });
    });
    builder.addCase(buyFile.rejected, (state, action) => {
      state.posts.find((mirror) => {
        if (mirror.mirrorId === action.meta.arg.mirrorFile.indexFileId) {
          mirror.mirrorFile = {
            ...action.meta.arg.mirrorFile,
            isBuying: false,
            isBoughtSuccessfully: false,
          };
        }
      });
      alert(action.error.message);
    });
  },
});

export default folderSlice.reducer;
