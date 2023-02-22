import { CustomMirrorFile } from "@/types";
import { getAddressFromDid } from "@/utils/didAndAddress";
import {
  FileType,
  FolderType,
  IndexFileContentType,
  Mirror,
  Mirrors,
  ModelNames,
  StructuredFolder,
} from "@dataverse/runtime-connector";
import { runtimeConnector, appName } from ".";
import { getAppNameAndModelNameByModelId } from "./appRegistry";
import { decryptWithLit } from "./encryptionAndDecryption";

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
          await rebuildMirrorFile(mirror.mirrorFile);
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

export const readMyDefaultFolder = async (did: string) => {
  const folder = await runtimeConnector.readDefaultFolder({
    did,
    appName,
  });
  console.log({ folders: JSON.parse(JSON.stringify(folder)) });
  await Promise.all(
    Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
      await rebuildMirrorFile(mirror.mirrorFile);
      // await decryptPost({ did, address, mirrorFile: mirror.mirrorFile });
    })
  );

  const sortedMirrors = Object.values(folder.mirrors as Mirrors).sort(
    (mirrorA, mirrorB) =>
      Date.parse(mirrorB.mirrorFile.updatedAt!) -
      Date.parse(mirrorA.mirrorFile.updatedAt!)
  );

  return { ...folder, mirrors: sortedMirrors };
};

export const decryptPost = async ({
  did,
  mirrorFile,
}: {
  did: string;
  mirrorFile: CustomMirrorFile;
}) => {
  mirrorFile = JSON.parse(JSON.stringify(mirrorFile));
  
  if (!(mirrorFile.contentType! in IndexFileContentType)) {
    if (
      mirrorFile.fileType !== FileType.Public &&
      (mirrorFile.fileKey ||
        (mirrorFile.encryptedSymmetricKey &&
          mirrorFile.decryptionConditions &&
          mirrorFile.decryptionConditionsType))
    ) {
      if (
        mirrorFile.appName === appName &&
        mirrorFile.modelName === ModelNames.post
      ) {
        try {
          const content = await decryptWithLit({
            did,
            encryptedContent: mirrorFile.content.content,
            ...(mirrorFile.fileKey
              ? { symmetricKeyInBase16Format: mirrorFile.fileKey }
              : {
                  encryptedSymmetricKey: mirrorFile.encryptedSymmetricKey,
                  decryptionConditions: mirrorFile.decryptionConditions,
                  decryptionConditionsType: mirrorFile.decryptionConditionsType,
                }),
          });
          mirrorFile.content.content = content;
        } catch (error) {
          console.log({ error });
        }
      }
    }
  }
  return mirrorFile;
};

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
