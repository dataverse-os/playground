import { CustomMirrorFile, PostStream } from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import { decode } from "@/utils/encodeAndDecode";
import {
  FileType,
  FolderType,
  IndexFile,
  IndexFileContentType,
  Mirror,
  Mirrors,
  ModelNames,
  StructuredFolder,
} from "@dataverse/runtime-connector";
import { runtimeConnector, appName, modelName } from ".";
import {
  getAppNameAndModelNameByModelId,
  getModelIdByModelName,
} from "./appRegistry";

export const readOthersFolders = async (did: string) => {
  const othersFolders = await runtimeConnector.readFolders({
    did,
    appName,
  });
  return othersFolders;
};

export const readMyFolders = async (did: string) => {
  const folders = await runtimeConnector.readFolders({
    did,
    appName,
  });

  await Promise.all(
    Object.values(folders).map((folder) => {
      return Promise.all(
        Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
          await rebuildMirrorFile(mirror.mirrorFile as CustomMirrorFile);
          // await decryptPost({ did, address, mirrorFile: mirror.mirrorFile });
        })
      );
    })
  );

  const sortedFolders = Object.values(folders).sort(
    (folderA, folderB) =>
      Date.parse(folderB.updatedAt) - Date.parse(folderA.updatedAt)
  );

  const visualFolders = sortedFolders.map((folder) => {
    const sortedMirrors = Object.values(folder.mirrors as Mirrors).sort(
      (mirrorA, mirrorB) =>
        Date.parse(mirrorB.mirrorFile.updatedAt!) -
        Date.parse(mirrorA.mirrorFile.updatedAt!)
    );
    return { ...folder, mirrors: sortedMirrors };
  });

  return visualFolders;
};

export const readMyPosts = async (did: string) => {
  const folders = await runtimeConnector.readFolders({
    did,
    appName,
  });

  const postModelId = await getModelIdByModelName(modelName);

  const mirrors = Object.values(folders)
    .map((folder) =>
      Object.values(folder.mirrors as Mirrors).filter((mirror) => {
        if (mirror.mirrorFile.contentType === postModelId) {
          try {
            mirror.mirrorFile.content.content = JSON.parse(
              mirror.mirrorFile.content.content
            );
          } catch (error) {}
          return true;
        }
      })
    )
    .flat();

  const sortedMirrors = Object.values(mirrors).sort(
    (mirrorA, mirrorB) =>
      Date.parse(mirrorB.mirrorFile.updatedAt!) -
      Date.parse(mirrorA.mirrorFile.updatedAt!)
  );
  // console.log(sortedMirrors.map((mirror) => mirror.mirrorFile.indexFileId));
  // console.log(
  //   sortedMirrors.map(
  //     (mirror) => (mirror.mirrorFile.content.content as Post).postContent
  //   )
  // );
  return sortedMirrors;
};

export const readMyDefaultFolder = async (did: string) => {
  const folder = await runtimeConnector.readDefaultFolder({
    did,
    appName,
  });

  await Promise.all(
    Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
      await rebuildMirrorFile(mirror.mirrorFile as CustomMirrorFile);
      // await decryptPost({ did, address, mirrorFile: mirror.mirrorFile });
    })
  );

  const sortedMirrors = Object.values(folder.mirrors as Mirrors)
    .sort(
      (mirrorA, mirrorB) =>
        Date.parse(mirrorB.mirrorFile.updatedAt!) -
        Date.parse(mirrorA.mirrorFile.updatedAt!)
    )
    .filter(
      (mirror) => !(mirror.mirrorFile.contentType! in IndexFileContentType)
    );

  return { ...folder, mirrors: sortedMirrors };
};

// export const decryptPost = async ({
//   did,
//   postStream,
// }: {
//   did: string;
//   postStream: PostStream;
// }) => {
//   const newPostStream = JSON.parse(JSON.stringify(postStream)) as PostStream;
//   const {
//     fileType,
//     encryptedSymmetricKey,
//     decryptionConditions,
//     decryptionConditionsType,
//   } = newPostStream.streamContent;
//   if (
//     newPostStream.streamContent.fileType !== FileType.Public &&
//     encryptedSymmetricKey &&
//     decryptionConditions &&
//     decryptionConditionsType
//   ) {
//     try {
//       const content = await decryptWithLit({
//         did,
//         encryptedContent: (newPostStream.streamContent.content.content as Post)
//           .postContent as string,
//         encryptedSymmetricKey: encryptedSymmetricKey,
//         decryptionConditions: decryptionConditions,
//         decryptionConditionsType: decryptionConditionsType,
//       });
//       (newPostStream.streamContent.content.content as Post).postContent =
//         JSON.parse(content);
//     } catch (error) {
//       console.log({ error });
//     }
//   }
//   return newPostStream;
// };

export const rebuildMirrorFile = async (mirrorFile: CustomMirrorFile) => {
  const res = await getAppNameAndModelNameByModelId(mirrorFile.contentType!);
  mirrorFile = Object.assign(mirrorFile, res);
  return mirrorFile;
};

export const createFolder = async (did: string) => {
  const res = await runtimeConnector.createFolder({
    did,
    appName,
    folderType: FolderType.Private,
    folderName: "Private",
  });
  return res;
};

export const changeFolderBaseInfo = async ({
  did,
  folderId,
}: {
  did: string;
  folderId: string;
}) => {
  const res = await runtimeConnector.changeFolderBaseInfo({
    did,
    appName,
    folderId,
    newFolderName: new Date().toISOString(),
    // syncImmediately: true,
  });
  return res;
};

export const changeFolderType = async ({
  did,
  folderId,
}: {
  did: string;
  folderId: string;
}) => {
  const res = await runtimeConnector.changeFolderType({
    did,
    appName,
    folderId,
    targetFolderType: FolderType.Public,
    // syncImmediately: true,
  });
  return res;
};
