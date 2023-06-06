import { FolderType } from "@dataverse/runtime-connector";
import { runtimeConnector, appName } from ".";

export const readOthersFolders = async (pkh: string) => {
  const othersFolders = await runtimeConnector.readFolders(appName);
  return othersFolders;
};

export const createFolder = async () => {
  const res = await runtimeConnector.createFolder({
    app: appName,
    folderType: FolderType.Private,
    folderName: "Private",
  });
  return res;
};

export const changeFolderBaseInfo = async ({
  folderId,
}: {
  did: string;
  folderId: string;
}) => {
  const res = await runtimeConnector.updateFolderBaseInfo({
    app: appName,
    folderId,
    newFolderName: new Date().toISOString(),
    // syncImmediately: true,
  });
  return res;
};

export const changeFolderType = async ({
  folderId,
}: {
  did: string;
  folderId: string;
}) => {
  const res = await runtimeConnector.changeFolderType({
    app: appName,
    folderId,
    targetFolderType: FolderType.Public,
    // syncImmediately: true,
  });
  return res;
};
