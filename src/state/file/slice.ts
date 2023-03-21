import { createSlice } from "@reduxjs/toolkit";

interface Props {}

const initialState: Props = {};

// export const monetizeFile = createAsyncThunk(
//   "file/monetizeFile",
//   async ({
//     did,
//     mirrorFile,
//   }: {
//     did: string;
//     mirrorFile: CustomMirrorFile;
//   }) => {
//     const { datatokenId } = await createDatatoken({
//       streamId: mirrorFile.indexFileId,
//       collectLimit: 50,
//       amount: 0.0002,
//       currency: Currency.WMATIC,
//     });
//     if (!(mirrorFile.contentType in IndexFileContentType)) {
//       let contentToBeEncrypted: string;

//       mirrorFile = JSON.parse(JSON.stringify(mirrorFile));

//       if (mirrorFile.isDecryptedSuccessfully) {
//         mirrorFile.content.content.options = {
//           lockedImagesNum: (
//             mirrorFile.content.content.postContent as PostContent
//           ).images?.length,
//           lockedVideosNum: (
//             mirrorFile.content.content.postContent as PostContent
//           ).videos?.length,
//         };
//         contentToBeEncrypted =
//           mirrorFile.contentType in IndexFileContentType
//             ? mirrorFile.contentId!
//             : JSON.stringify(mirrorFile.content.content.postContent);
//       } else if (mirrorFile.fileType === FileType.Private) {
//         const res = await decryptPost({
//           did,
//           mirrorFile,
//         });
//         mirrorFile.content.content.options = {
//           lockedImagesNum: (res.content.content.postContent as PostContent)
//             .images?.length,
//           lockedVideosNum: (res.content.content.postContent as PostContent)
//             .videos?.length,
//         };
//         contentToBeEncrypted =
//           mirrorFile.contentType in IndexFileContentType
//             ? res.contentId!
//             : JSON.stringify(res.content.content.postContent);
//       } else {
//         mirrorFile.content.content.options = {
//           lockedImagesNum: (
//             mirrorFile.content.content.postContent as PostContent
//           ).images?.length,
//           lockedVideosNum: (
//             mirrorFile.content.content.postContent as PostContent
//           ).videos?.length,
//         };
//         contentToBeEncrypted =
//           mirrorFile.contentType in IndexFileContentType
//             ? mirrorFile.contentId!
//             : JSON.stringify(mirrorFile.content.content.postContent);
//       }

//       mirrorFile.datatokenId = datatokenId;

//       if (mirrorFile.contentType in IndexFileContentType) {
//         mirrorFile.contentId = contentToBeEncrypted;
//       } else {
//         mirrorFile.content.content.postContent = contentToBeEncrypted;
//       }

//       const res = await updatePostStreamsWithAccessControlConditions({
//         did,
//         address: getAddressFromDid(did),
//         mirrorFile,
//       });
//       return res;
//     } else {
//       mirrorFile = JSON.parse(JSON.stringify(mirrorFile));
//       mirrorFile.datatokenId = datatokenId;

//       const res = await updateFileStreamsWithAccessControlConditions({
//         did,
//         address: getAddressFromDid(did),
//         mirrorFile,
//       });
//       return res;
//     }
//   }
// );

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default fileSlice.reducer;
