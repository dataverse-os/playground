import {
  Apps,
  DecryptionConditionsTypes,
  FileType,
  MirrorFile,
  ModelNames,
} from "@dataverse/dataverse-kernel";
import {
  runtimeConnector,
  appName,
  modelNames,
  modelName,
  appVersion,
} from ".";
import { newLitKey, encryptWithLit } from "./lit";

export const loadStream = async (streamId: string) => {
  const stream = await runtimeConnector.loadStream(streamId);
  return stream;
};

export const loadMyPostStreamsByModel = async (did: string) => {
  const streams = await runtimeConnector.loadStreamsByModel({
    did,
    appName: Apps.dTwitter,
    modelName: ModelNames.post,
  });

  const streamList: { streamId: string; streamContent: any }[] = [];

  Object.entries(streams).forEach(([streamId, streamContent]) => {
    streamList.push({
      streamId,
      streamContent,
    });
  });

  return streamList;
};

export const createPublicPostStream = async ({
  did,
  content,
}: {
  did: string;
  content: string;
}) => {
  const streamObject = await runtimeConnector.createStream({
    did,
    appName: Apps.dTwitter,
    modelName: ModelNames.post,
    streamContent: {
      appVersion,
      content,
    },
    fileType: FileType.Public,
  });
  return streamObject;
};

export const createPrivatePostStream = async ({
  did,
  encryptedContent,
  litKit,
}: {
  did: string;
  encryptedContent: string;
  litKit: {
    encryptedSymmetricKey: string;
    decryptionConditions: any[];
    decryptionConditionsType: DecryptionConditionsTypes;
  };
}) => {
  console.log({ encryptedContent });
  console.log({ litKit });
  const streamObject = await runtimeConnector.createStream({
    did,
    appName,
    modelName,
    streamContent: {
      appVersion,
      content: encryptedContent,
    },
    fileType: FileType.Private,
    ...litKit,
  });
  return streamObject;
};

export const updatePostStreamsToPublicContent = async (
  mirrorFile: MirrorFile
) => {
  if (!mirrorFile) return;
  const { contentId: streamId, content: streamContent } = mirrorFile;
  if (!streamId || !streamContent) return;

  streamContent.content = "update my post -- public" + new Date().toISOString(); //public

  const streams = await runtimeConnector.updateStreams({
    streamsRecord: {
      [streamId]: {
        streamContent,
        fileType: FileType.Public,
      },
    },
    syncImmediately: true,
  });
  return streams;
};

export const updatePostStreamsToPrivateContent = async ({
  did,
  address,
  mirrorFile,
}: {
  did: string;
  address: string;
  mirrorFile: MirrorFile;
}) => {
  if (!mirrorFile) return;
  const { contentId: streamId, content: streamContent } = mirrorFile;
  if (!streamId || !streamContent) return;

  let litKit;

  const {
    encryptedSymmetricKey,
    decryptionConditions,
    decryptionConditionsType,
  } = mirrorFile;

  if (
    encryptedSymmetricKey &&
    decryptionConditions &&
    decryptionConditionsType
  ) {
    litKit = {
      encryptedSymmetricKey,
      decryptionConditions,
      decryptionConditionsType,
    };
  } else {
    litKit = await newLitKey({
      did,
      address,
    });
  }

  const { encryptedContent } = await encryptWithLit({
    did,
    address,
    content: "update my post -- private" + new Date().toISOString(),
    litKit,
  });

  streamContent.content = encryptedContent;

  const streams = await runtimeConnector.updateStreams({
    streamsRecord: {
      [streamId]: {
        streamContent: streamContent,
        fileType: FileType.Private,
        ...litKit,
      },
    },
    syncImmediately: true,
  });
  return streams;
};
