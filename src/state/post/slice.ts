import { createPublicPostStream, loadMyPostStreamsByModel } from "@/sdk/stream";
import { StreamObject } from "@dataverse/runtime-connector";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  postList: StreamObject[];
}

const initialState: Props = {
  postList: [],
};

export const publishPost = createAsyncThunk(
  "post/publishPost",
  async ({ did, content }: { did: string; content: string }) => {
    const res = await createPublicPostStream({ did, content });
    return res;
  }
);

export const displayPostList = createAsyncThunk(
  "post/displayPostList",
  async (did: string) => {
    const res = await loadMyPostStreamsByModel(did);
    return res;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // setTweetUrl: (state, action: PayloadAction<string>) => {
    //   state.tweetUrl = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(publishPost.fulfilled, (state, action) => {
      state.postList.push(action.payload);
    });
    builder.addCase(displayPostList.fulfilled, (state, action) => {
      state.postList = action.payload;
    });
  },
});

export default postSlice.reducer;
