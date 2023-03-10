import { collect, createDatatoken } from "@/sdk/monetize";
import {
  updateFileStreamsWithAccessControlConditions,
  updatePostStreamsWithAccessControlConditions,
} from "@/sdk/stream";
import { CustomMirrorFile, PostContent } from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import {
  Currency,
  FileType,
  IndexFileContentType,
} from "@dataverse/runtime-connector";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { decryptPost } from "@/sdk/folder";

interface Props {}

const initialState: Props = {};

export const monetizeFile = createAsyncThunk(
  "file/monetizeFile",
  async ({
    did,
    mirrorFile,
  }: {
    did: string;
    mirrorFile: CustomMirrorFile;
  }) => {
    const { datatokenId } = await createDatatoken({
      streamId: mirrorFile.indexFileId,
      collectLimit: 50,
      amount: 0.0002,
      currency: Currency.WMATIC,
    });
    if (!(mirrorFile.contentType in IndexFileContentType)) {
      let contentToBeEncrypted: string;

      mirrorFile = JSON.parse(JSON.stringify(mirrorFile));

      mirrorFile.content.content.options = {
        lockedImagesNum: (mirrorFile.content.content.postContent as PostContent)
          .images?.length,
        lockedVideosNum: (mirrorFile.content.content.postContent as PostContent)
          .videos?.length,
      };

      if (mirrorFile.isDecryptedSuccessfully) {
        contentToBeEncrypted =
          mirrorFile.contentType in IndexFileContentType
            ? mirrorFile.contentId!
            : JSON.stringify(mirrorFile.content.content.postContent);
      } else if (mirrorFile.fileType === FileType.Private) {
        const res = await decryptPost({
          did,
          mirrorFile,
        });
        contentToBeEncrypted =
          mirrorFile.contentType in IndexFileContentType
            ? res.contentId!
            : JSON.stringify(res.content.content.postContent);
      } else {
        contentToBeEncrypted =
          mirrorFile.contentType in IndexFileContentType
            ? mirrorFile.contentId!
            : JSON.stringify(mirrorFile.content.content.postContent);
      }

      mirrorFile.datatokenId = datatokenId;

      if (mirrorFile.contentType in IndexFileContentType) {
        mirrorFile.contentId = contentToBeEncrypted;
      } else {
        mirrorFile.content.content.postContent = contentToBeEncrypted;
      }

      const res = await updatePostStreamsWithAccessControlConditions({
        did,
        address: getAddressFromDid(did),
        mirrorFile,
      });
      return res;
    } else {
      mirrorFile = JSON.parse(JSON.stringify(mirrorFile));
      mirrorFile.datatokenId = datatokenId;

      const res = await updateFileStreamsWithAccessControlConditions({
        did,
        address: getAddressFromDid(did),
        mirrorFile,
      });
      return res;
    }
  }
);

export const buyFile = createAsyncThunk(
  "file/buyFile",
  async ({
    did,
    mirrorFile,
  }: {
    did: string;
    mirrorFile: CustomMirrorFile;
  }) => {
    await collect(mirrorFile.datatokenId!);
    const res = await decryptPost({ did, mirrorFile });
    return res;
  }
);

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default fileSlice.reducer;
