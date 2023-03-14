import { encryptWithLit, newLitKey } from "@/sdk/encryptionAndDecryption";
import { decryptFile, decryptPost as _decryptPost } from "@/sdk/folder";
import {
  createDatatokenPostStream,
  createPublicPostStream,
  generateAccessControlConditions,
  loadMyPostStreams,
} from "@/sdk/stream";
import { CustomMirrorFile, LitKit, PostContent, PostType } from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import {
  DecryptionConditionsTypes,
  IndexFileContentType,
  StreamObject,
} from "@dataverse/runtime-connector";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Props {
  isEncrypting?: boolean;
  encryptedContent?: string;
  isEncryptedSuccessfully?: boolean;
  litKit?: LitKit;
  isPublishingPost: boolean;
  postList: StreamObject[];
}

const initialState: Props = {
  isEncrypting: false,
  encryptedContent: "",
  isEncryptedSuccessfully: false,
  litKit: undefined,
  isPublishingPost: false,
  postList: [],
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
  async ({
    did,
    mirrorFile,
  }: {
    did: string;
    mirrorFile: CustomMirrorFile;
  }) => {
    if (!(mirrorFile.contentType in IndexFileContentType)) {
      const res = await _decryptPost({
        did,
        mirrorFile,
      });
      return res;
    }
    const res = await decryptFile({
      did,
      mirrorFile,
    });
    return res;
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
    };
    console.log(post)
    try {
      let res;
      if (postType === PostType.Public) {
        res = await createPublicPostStream({ did, post });
      } else if (postType === PostType.Private) {
        // res = await createPrivatePostStream({ did, content, litKit });
      } else {
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
  async (did: string) => {
    const res = await loadMyPostStreams(did);
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

    builder.addCase(publishPost.pending, (state) => {
      state.isPublishingPost = true;
    });
    builder.addCase(publishPost.fulfilled, (state, action) => {
      state.isPublishingPost = false;
    });
    builder.addCase(publishPost.rejected, (state) => {
      state.isPublishingPost = false;
    });

    builder.addCase(displayPostList.fulfilled, (state, action) => {
      state.postList = action.payload;
    });
  },
});

export default postSlice.reducer;
