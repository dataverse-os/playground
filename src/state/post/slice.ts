import { encryptWithLit, newLitKey } from "@/sdk/encryptionAndDecryption";
import { decryptFile, decryptPost as _decryptPost } from "@/sdk/folder";
import { getDatatokenInfo as _getDatatokenInfo } from "@/sdk/monetize";
import {
  createDatatokenPostStream,
  createPublicPostStream,
  generateAccessControlConditions,
  loadAllPostStreams,
  loadMyPostStreams,
} from "@/sdk/stream";
import {
  CustomMirrorFile,
  LitKit,
  Post,
  PostContent,
  PostStream,
  PostType,
} from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import { web3Storage } from "@/utils/web3Storage";
import {
  DecryptionConditionsTypes,
  IndexFile,
  IndexFileContentType,
  StreamObject,
} from "@dataverse/runtime-connector";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";

interface Props {
  isEncrypting?: boolean;
  encryptedContent?: string;
  isEncryptedSuccessfully?: boolean;
  litKit?: LitKit;
  isPublishingPost: boolean;
  postStreamList: PostStream[];
}

const initialState: Props = {
  isEncrypting: false,
  encryptedContent: "",
  isEncryptedSuccessfully: false,
  litKit: undefined,
  isPublishingPost: false,
  postStreamList: [],
};

export const encryptPost = createAsyncThunk(
  "post/encryptPost",
  async ({ did, postContent }: { did: string; postContent: PostContent }) => {
    const address = getAddressFromDid(did);

    const decryptionConditions = await generateAccessControlConditions({
      did,
      address,
    });

    const decryptionConditionsType =
      DecryptionConditionsTypes.AccessControlCondition;

    const litKit = await newLitKey({
      did,
      decryptionConditions,
      decryptionConditionsType,
    });

    const res = await encryptWithLit({
      did,
      contentToBeEncrypted: JSON.stringify(postContent),
      litKit,
    });

    return res;
  }
);

export const decryptPost = createAsyncThunk(
  "post/decryptPost",
  async ({ did, postStream }: { did: string; postStream: PostStream }) => {
    const res = await _decryptPost({
      did,
      postStream,
    });
    return res;
  }
);

export const uploadImg = createAsyncThunk(
  "post/uploadImg",
  async ({ files }: { files: File[] }): Promise<string[]> => {
    const imgCIDs = await Promise.all(
      files.map((file) => web3Storage.storeFiles([file]))
    );
    const imgUrls = imgCIDs.map((cid) => `https://${cid}.ipfs.dweb.link`);
    return imgUrls;
  }
);

export const publishPost = createAsyncThunk(
  "post/publishPost",
  async ({ did, postContent }: { did: string; postContent: PostContent }) => {
    const rootStore = await import("@/state/store");
    const { settings } = rootStore.default.store.getState().privacySettings;
    const { postType, currency, amount, collectLimit } = settings;

    const post = {
      postContent,
      createdAt: new Date().toISOString(),
      postType,
    } as Post;

    try {
      let res;
      if (postType === PostType.Public) {
        res = await createPublicPostStream({ did, post });
      } else if (postType === PostType.Private) {
        // res = await createPrivatePostStream({ did, content, litKit });
      } else {
        if (
          (postContent.images && postContent.images?.length > 0) ||
          (postContent.videos && postContent.videos?.length > 0)
        ) {
          post.options = {
            lockedImagesNum: postContent.images?.length ?? 0,
            lockedVideosNum: postContent.videos?.length ?? 0,
          };
        }
        res = await createDatatokenPostStream({
          did,
          post,
          currency: currency!,
          amount: amount!,
          collectLimit: collectLimit!,
        });
      }
      return res;
    } catch (error: any) {
      alert(error?.message ?? error);
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
    console.log(res)
    return res;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setIsPublishingPost: (state, action: PayloadAction<boolean>) => {
      state.isPublishingPost = action.payload;
    },
    clearEncryptedState: (state) => {
      state.encryptedContent = "";
      state.isEncryptedSuccessfully = false;
      state.litKit = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(displayPostList.fulfilled, (state, action) => {
      state.postStreamList = action.payload;
    });

    builder.addCase(encryptPost.pending, (state) => {
      state.isEncrypting = true;
      state.isEncryptedSuccessfully = false;
    });
    builder.addCase(encryptPost.fulfilled, (state, action) => {
      state.encryptedContent = action.payload.encryptedContent;
      state.litKit = action.payload.litKit;
      state.isEncrypting = false;
      state.isEncryptedSuccessfully = true;
    });
    builder.addCase(encryptPost.rejected, (state) => {
      state.isEncrypting = false;
      state.isEncryptedSuccessfully = false;
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
      console.log(state);
      state.isPublishingPost = true;
    });
    // builder.addCase(publishPost.fulfilled, (state, action, ) => {
    //   state.isPublishingPost = false;
    // });
    builder.addCase(publishPost.rejected, (state) => {
      state.isPublishingPost = false;
    });

    //decryptPostListener
    builder.addCase(decryptPost.pending, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.meta.arg.postStream,
            isDecrypting: false,
            isDecryptedSuccessfully: true,
          });
        }
      });
      state.postStreamList = postStreamList;
    });
    builder.addCase(decryptPost.fulfilled, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.payload,
            isDecrypting: false,
            isDecryptedSuccessfully: true,
          });
        }
      });
      state.postStreamList = postStreamList;
    });
    builder.addCase(decryptPost.rejected, (state, action) => {
      const postStreamList = JSON.parse(
        JSON.stringify(current(state.postStreamList))
      ) as PostStream[];
      postStreamList.find((postStream) => {
        if (postStream.streamId === action.meta.arg.postStream.streamId) {
          postStream = Object.assign(postStream, {
            ...action.meta.arg.postStream,
            isDecrypting: false,
            isDecryptedSuccessfully: false,
          });
        }
      });
      state.postStreamList = postStreamList;
      alert(action.error.message);
    });
    // builder.addCase(decryptPost.fulfilled, (state, action) => {
    //   console.log(state.postStreamList);
    //   state.postStreamList.find((postStream) => {
    //     if (postStream.streamId === action.meta.arg.postStream.streamId) {
    //       postStream = {
    //         ...postStream,
    //         isDecrypting: false,
    //         isDecryptedSuccessfully: true,
    //       };
    //     }
    //   });
    // });
    // builder.addCase(decryptPost.rejected, (state, action) => {
    //   state.postStreamList.find((postStream) => {
    //     if (postStream.streamId === action.meta.arg.postStream.streamId) {
    //       postStream = {
    //         ...postStream,
    //         isDecrypting: false,
    //         isDecryptedSuccessfully: false,
    //       };
    //     }
    //   });
    //   alert(action.error.message);
    // });
  },
});

export default postSlice.reducer;
