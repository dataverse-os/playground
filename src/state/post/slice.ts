import {
  getDatatokenInfo as _getDatatokenInfo,
  isCollected,
  unlock,
} from "@/sdk/monetize";
import {
  createPayablePost,
  createPublicPost,
  loadAllPostStreams,
} from "@/sdk/post";
import {
  CustomMirrorFile,
  PostStream,
  PostType,
  StructuredPost,
} from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import { web3Storage } from "@/utils/web3Storage";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import { Message } from "@arco-design/web-react";
import { connectIdentity } from "@/sdk/identity";
import { appName, appVersion } from "@/sdk";

interface Props {
  isEncrypting?: boolean;
  encryptedContent?: string;
  isEncryptedSuccessfully?: boolean;
  isPublishingPost: boolean;
  postStreamList: PostStream[];
}

const initialState: Props = {
  isEncrypting: false,
  encryptedContent: "",
  isEncryptedSuccessfully: false,
  isPublishingPost: false,
  postStreamList: [],
};

export const unlockPost = createAsyncThunk(
  "post/unlockPost",
  async ({ postStream }: { postStream: PostStream }) => {
    const res = await unlock({
      streamId: postStream.streamId,
    });
    const postStreamCopy = JSON.parse(JSON.stringify(postStream));
    postStreamCopy.streamContent = res;
    return postStreamCopy;
  }
);

export const uploadImg = createAsyncThunk(
  "post/uploadImg",
  async ({ files }: { files: File[] }): Promise<string[]> => {
    const imgCIDs = await Promise.all(
      files.map((file) => web3Storage.storeFiles([file]))
    );
    const imgUrls = imgCIDs.map((cid) => `https://${cid}.ipfs.w3s.link`);
    return imgUrls;
  }
);

export const publishPost = createAsyncThunk(
  "post/publishPost",
  async ({
    profileId,
    text,
    images,
    videos,
    encrypted,
  }: {
    profileId?: string;
    text: string;
    images: string[];
    videos: string[];
    encrypted?: {
      appVersion?: boolean;
      text?: boolean;
      images?: boolean;
      videos?: boolean;
      postType?: boolean;
      options?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    };
  }) => {
    const rootStore = await import("@/state/store");
    const { settings } = rootStore.default.store.getState().privacySettings;
    const { postType, currency, amount, collectLimit } = settings;

    const date = new Date().toISOString();

    const post = {
      appVersion,
      text,
      images,
      videos,
      createdAt: date,
      updatedAt: date,
      encrypted
    } as StructuredPost;

    try {
      let res;
      if (postType === PostType.Public) {
        res = await createPublicPost({ post });
      } else if (postType === PostType.Private) {
        // res = await createPrivatePostStream({ did, content, litKit });
      } else {
        res = await createPayablePost({
          post,
          profileId: profileId!,
          currency: currency!,
          amount: amount!,
          collectLimit: collectLimit!,
        });
      }
      return res;
    } catch (error: any) {
      (error?.message ?? error) &&
        Message.error((error?.message ?? error).slice(0, 100));
      throw error;
    }
  }
);

export const displayPostList = createAsyncThunk(
  "post/displayPostList",
  async () => {
    const res = await loadAllPostStreams();
    return res;
  }
);

export const getDatatokenInfo = createAsyncThunk(
  "post/getDatatokenInfo",
  async ({ address }: { address: string }) => {
    const res = await _getDatatokenInfo({
      address,
    });
    return res.dataToken;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setIsPublishingPost: (state, action: PayloadAction<boolean>) => {
      state.isPublishingPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(displayPostList.fulfilled, (state, action) => {
      state.postStreamList = action.payload;
    });

    builder.addCase(uploadImg.pending, (state) => {
      state.isPublishingPost = true;
    });
    builder.addCase(uploadImg.fulfilled, (state, action) => {
      state.isPublishingPost = false;
    });
    builder.addCase(uploadImg.rejected, (state) => {
      state.isPublishingPost = false;
    });

    builder.addCase(publishPost.pending, (state) => {
      state.isPublishingPost = true;
    });

    builder.addCase(publishPost.rejected, (state) => {
      state.isPublishingPost = false;
    });

    //buyPostListener
    builder.addCase(unlockPost.pending, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.meta.arg.postStream,
            isUnlocking: true,
          });
        }
      });
      state.postStreamList = postStreamList;
    });
    builder.addCase(unlockPost.fulfilled, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.payload,
            isUnlocking: false,
            hasUnlockedSuccessfully: true,
          });
        }
      });
      state.postStreamList = postStreamList;
    });
    builder.addCase(unlockPost.rejected, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.meta.arg.postStream,
            isUnlocking: false,
            hasUnlockedSuccessfully: false,
          });
        }
      });
      state.postStreamList = postStreamList;
      action.error.message && Message.error(action.error.message.slice(0, 100));
    });
    //getDatatokenInfo
    builder.addCase(getDatatokenInfo.pending, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamContent.datatokenId === action.meta.arg.address) {
          postStream = {
            ...postStream,
            isGettingDatatokenInfo: true,
          };
        }
      });
      state.postStreamList = postStreamList;
    });
    builder.addCase(getDatatokenInfo.fulfilled, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamContent.datatokenId === action.meta.arg.address) {
          postStream.streamContent.datatokenInfo = {
            ...postStream.streamContent.datatokenInfo,
            ...action.payload,
          };
          postStream = {
            ...postStream,
            isGettingDatatokenInfo: false,
            hasGotDatatokenInfo: true,
          };
        }
      });
      state.postStreamList = postStreamList;
    });

    builder.addCase(getDatatokenInfo.rejected, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamContent.datatokenId === action.meta.arg.address) {
          postStream = {
            ...postStream,
            isGettingDatatokenInfo: false,
            hasGotDatatokenInfo: true,
          };
        }
      });
      state.postStreamList = postStreamList;
    });
  },
});

export default postSlice.reducer;
