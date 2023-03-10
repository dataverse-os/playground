import { encryptWithLit, newLitKey } from "@/sdk/encryptionAndDecryption";
import { decryptFile, decryptPost as _decryptPost } from "@/sdk/folder";
import {
  createPrivatePostStream,
  createPublicPostStream,
  generateAccessControlConditions,
  loadMyPostStreamsByModel,
} from "@/sdk/stream";
import { CustomMirrorFile, LitKit, Post, PostContent, PostType } from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import { encode } from "@/utils/encodeAndDecode";
import {
  DecryptionConditionsTypes,
  IndexFileContentType,
  MirrorFile,
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
  async ({
    did,
    postContent,
    encryptedContent,
    litKit,
  }: {
    did: string;
    postContent: PostContent;
    encryptedContent?: string;
    litKit?: LitKit;
  }) => {
    const post = {
      postContent: litKit ? encryptedContent : postContent,
      createdAt: new Date().toISOString(),
      postType: litKit ? PostType.Private : PostType.Public,
    };

    const content = JSON.stringify(post);

    let res;
    if (!litKit) {
      res = await createPublicPostStream({ did, content });
    } else {
      res = await createPrivatePostStream({
        did,
        content,
        litKit,
      });
    }
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
      state.postList.push(action.payload);
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
