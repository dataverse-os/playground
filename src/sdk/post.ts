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
import { loadStreamsByModel } from "./stream";
import appJson from "../output/app.json"

export const loadAllPostStreams = async () => {
  const { modelId } = Object.values(appJson.models).find((model) =>
    model.modelName === 'playground_post'
  )!;

  let streams;
  if (await detectDataverseExtension()) {
    streams = await runtimeConnector.loadStreamsBy({
      modelId,
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

export const createPublicPost = async ({
  post,
}: {
  post: Partial<StructuredPost>;
}) => {
  const { modelId } = Object.values(appJson.models).find((model) =>
    model.modelName === 'playground_post'
  )!;

  console.log("createPublicPost, post:", post)

  let encrypted = {} as any;
  if (post && Object.keys(post).length > 0) {
    Object.keys(post).forEach((key) => {
      encrypted[key] = false;
    });
  }

  const streamObject = await runtimeConnector.createStream({
    modelId,
    streamContent: {
      ...post,
      ...(post && {
        encrypted: JSON.stringify(encrypted),
      }),
    },
  });

  return streamObject;
};

export const createEncryptedPost = async ({
  post,
}: {
  post: Partial<StructuredPost>;
}) => {
  const { modelId } = Object.values(appJson.models).find((model) =>
    model.modelName === 'playground_post'
  )!;

  const streamObject = await runtimeConnector.createStream({
    modelId,
    streamContent: {
      ...post,
      ...(post && {
        encrypted: JSON.stringify(post.encrypted),
      }),
    },
  });

  return streamObject;
}

export const createPayablePost = async ({
  post,
  profileId,
  currency,
  amount,
  collectLimit,
}: {
  post: Partial<StructuredPost>;
  profileId: string;
  currency: Currency;
  amount: number;
  collectLimit: number;
}) => {
  const { newFile } = await createEncryptedPost({ post });
  if (!newFile) {
    return
  }

  await monetizePost({
    profileId,
    mirrorFile: newFile,
    currency,
    amount,
    collectLimit
  })
}

const monetizePost = async ({
  profileId,
  mirrorFile,
  currency,
  amount,
  collectLimit,
}: {
  mirrorFile: MirrorFile;
  profileId?: string;
  currency: Currency;
  amount: number;
  collectLimit: number;
}) => {
  try {
    await runtimeConnector.monetizeFile({
      app: appName,
      indexFileId: mirrorFile.indexFileId,
      datatokenVars: {
        profileId,
        currency,
        amount,
        collectLimit,
      }
    });
  } catch (error: any) {
    console.error(error);
    if (
      error !==
      "networkConfigurationId undefined does not match a configured networkConfiguration"
    ) {
      await runtimeConnector.removeFiles({
        app: appName,
        indexFileIds: [mirrorFile.indexFileId]
      })
    }
    throw error;
  }
};

export const deletePostStream = async ({
  mirrorId,
}: {
  mirrorId: string;
}) => {
  const res = await runtimeConnector.removeFiles({
    app: appName,
    indexFileIds: [mirrorId],
  });
  return res;
};
