import {
  PostStream,
  CustomMirrorFile,
  StructuredPost,
  NativePost,
} from "@/types";
import { detectDataverseExtension } from "@/utils/checkIsExtensionInjected";

import { getAddressFromDid } from "@/utils/didAndAddress";
import {
  FileType,
  DecryptionConditionsTypes,
  Currency,
  ModelNames,
  MirrorFile,
  IndexFileContentType,
} from "@dataverse/runtime-connector";
import {
  runtimeConnector,
  appName,
  modelNames,
  modelName,
  appVersion,
} from ".";
import { getModelIdByModelName } from "./appRegistry";
import { createDatatoken, getChainOfDatatoken } from "./monetize";
import { loadStreamsByModel } from "./stream";

export const loadMyPostStreams = async (did: string) => {
  const streams = await runtimeConnector.loadStreamsByModelAndDID({
    did,
    appName,
    modelName,
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

export const loadAllPostStreams = async () => {
  let streams;
  if (await detectDataverseExtension()) {
    streams = await runtimeConnector.loadStreamsByModel({
      appName,
      modelName,
    });
  } else {
    streams = await loadStreamsByModel(modelName);
  }
  const streamList: PostStream[] = [];

  Object.entries(streams).forEach(([streamId, streamContent]) => {
    streamList.push({
      streamId,
      streamContent,
    });
  });
  const sortedList = streamList
    .filter(
      (el) =>
        el.streamContent.content?.appVersion === appVersion &&
        (el.streamContent.content.text ||
          (el.streamContent.content.images &&
            el.streamContent.content.images?.length > 0) ||
          (el.streamContent.content.videos &&
            el.streamContent.content.videos?.length > 0))
    )
    .sort(
      (a, b) =>
        Date.parse(b.streamContent.createdAt) -
        Date.parse(a.streamContent.createdAt)
    );
  console.log(sortedList);
  return sortedList;
};

export const createPublicPostStream = async ({
  did,
  post,
}: {
  did: string;
  post: Partial<StructuredPost>;
}) => {
  let encrypted = {} as any;
  if (post && Object.keys(post).length > 0) {
    Object.keys(post).forEach((key) => {
      encrypted[key] = false;
    });
  }

  const streamObject = await runtimeConnector.createStream({
    did,
    appName,
    modelName,
    streamContent: {
      ...post,
      ...(post && {
        encrypted: JSON.stringify(encrypted),
      }),
    },
    fileType: FileType.Public,
  });

  return streamObject;
};

export const createDatatokenPostStream = async ({
  did,
  post,
  profileId,
  currency,
  amount,
  collectLimit,
}: {
  did: string;
  post: Partial<StructuredPost>;
  profileId: string;
  currency: Currency;
  amount: number;
  collectLimit: number;
}) => {
  const res = await createPublicPostStream({
    did,
    post: { ...post, text: "", images: [], videos: [] } as StructuredPost,
  });
  console.log(res);
  let datatokenId;
  try {
    const res2 = await createDatatoken({
      profileId,
      streamId: res.newMirror!.mirrorId,
      currency,
      amount,
      collectLimit,
    });
    datatokenId = res2.datatokenId;
  } catch (error: any) {
    console.log(error);
    await deletePostStream({ did, mirrorId: res.newMirror!.mirrorId });
    throw error;
  }
  const res2 = await updatePostStreamsWithAccessControlConditions({
    did,
    address: getAddressFromDid(did),
    mirrorFile: {
      contentId: res.streamId,
      content: post,
      datatokenId,
      contentType: await getModelIdByModelName(modelName),
    } as CustomMirrorFile,
  });

  return res2;
};

export const deletePostStream = async ({
  did,
  mirrorId,
}: {
  did: string;
  mirrorId: string;
}) => {
  const res = await runtimeConnector.removeMirrors({
    did,
    appName,
    mirrorIds: [mirrorId],
  });
  return res;
};

export const updatePostStreamsToPublicContent = async ({
  content,
  mirrorFile,
}: {
  content: string;
  mirrorFile: MirrorFile;
}) => {
  if (!mirrorFile) return;
  const { contentId: streamId, content: streamContent } = mirrorFile;
  if (!streamId || !streamContent) return;

  streamContent.content = content; //public content

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

export const updatePostStreamsWithAccessControlConditions = async ({
  did,
  address,
  mirrorFile,
}: {
  did: string;
  address: string;
  mirrorFile: CustomMirrorFile;
}) => {
  if (!mirrorFile) return;
  let { contentId: streamId, content: streamContent, datatokenId } = mirrorFile;
  if (!streamId) return;

  const nativeStreamContent = streamContent as NativePost;

  if (!datatokenId) {
    mirrorFile.fileType = FileType.Private;
  } else {
    mirrorFile.fileType = FileType.Datatoken;
  }

  nativeStreamContent.encrypted = JSON.stringify({
    text: true,
    images: true,
    videos: true,
  });

  if (streamContent.options) {
    nativeStreamContent.options = JSON.stringify(streamContent.options);
  }

  nativeStreamContent.updatedAt = new Date().toISOString();

  const res = await runtimeConnector.updateStreams({
    streamsRecord: {
      [streamId]: {
        streamContent: nativeStreamContent,
        fileType: mirrorFile.fileType,
        ...(datatokenId && { datatokenId: mirrorFile.datatokenId }),
      },
    },
    syncImmediately: true,
  });

  const updatedStreamContent = res?.successRecord[streamId];

  mirrorFile.fileKey = undefined;
  mirrorFile.encryptedSymmetricKey =
    updatedStreamContent?.encryptedSymmetricKey;
  mirrorFile.decryptionConditions = updatedStreamContent?.decryptionConditions;
  mirrorFile.decryptionConditionsType =
    updatedStreamContent?.decryptionConditionsType;

  return mirrorFile;
};
