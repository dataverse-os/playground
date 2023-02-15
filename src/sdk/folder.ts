import {
  FolderType,
  IndexFileContentType,
  Mirrors,
} from "@dataverse/runtime-connector";
import { runtimeConnector, appName } from ".";
import { decryptWithLit } from "./lit";

export const readOthersFolders = async (did: string) => {
  const othersFolders = await runtimeConnector.readFolders({
    did,
    appName,
  });
  console.log(othersFolders);
  return othersFolders;
};

export const readMyFolders = async ({
  did,
  address,
}: {
  did: string;
  address: string;
}) => {
  const folders = await runtimeConnector.readFolders({
    did,
    appName,
  });
  await Promise.all(
    Object.values(folders).map((folder) => {
      return Promise.all(
        Object.values(folder.mirrors as Mirrors).map(async (mirror) => {
          if (
            mirror.mirrorFile.contentType === IndexFileContentType.STREAM &&
            (mirror.mirrorFile.fileKey ||
              (mirror.mirrorFile.encryptedSymmetricKey &&
                mirror.mirrorFile.decryptionConditions &&
                mirror.mirrorFile.decryptionConditionsType))
          ) {
            try {
              const content = await decryptWithLit({
                did,
                address,
                encryptedContent: mirror.mirrorFile.content.content,
                ...(mirror.mirrorFile.fileKey
                  ? { symmetricKeyInBase16Format: mirror.mirrorFile.fileKey }
                  : {
                      encryptedSymmetricKey:
                        mirror.mirrorFile.encryptedSymmetricKey,
                    }),
              });
              mirror.mirrorFile.content.content = content;
              return mirror;
            } catch (error) {
              console.log(error);
            }
          }
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

export const createFolder = async (did: string) => {
  const res = await runtimeConnector.createFolder({
    did,
    appName,
    folderType: FolderType.Private,
    folderName: "Private",
  });
  console.log(res);
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
  console.log(res);
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
  console.log(res);
  return res;
};
/*** Folders ***/
