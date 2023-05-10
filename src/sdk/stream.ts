import { decode } from "@/utils/encodeAndDecode";
import {
  IndexFileContentType,
  ModelNames,
  StructuredFiles,
} from "@dataverse/runtime-connector";
import { appName, ceramic, ceramicClient, runtimeConnector } from ".";
import { getModelIdByModelName } from "./appRegistry";

export const loadStream = async (streamId: string) => {
  const stream = await runtimeConnector.loadStream({ appName, streamId });
  return stream;
};

export const loadStreamsByModel = async (modelName: string) => {
  let streams = await ceramic.loadStreamsByModel({
    model: (await getModelIdByModelName(modelName))!,
    ceramic: ceramicClient,
  });

  streams = await buildStreamsWithFiles({
    modelName,
    streams,
  });

  return streams;
};

export const buildStreamsWithFiles = async ({
  modelName,
  streams,
}: {
  modelName: string;
  streams: Record<string, any>;
}) => {
  if (
    modelName !== ModelNames.indexFiles &&
    modelName !== ModelNames.indexFolders &&
    modelName !== ModelNames.contentFolders
  ) {
    const indexFiles = await loadStreamsByModel(ModelNames.indexFiles);

    const structuredFiles = {} as StructuredFiles;

    Object.entries(indexFiles).forEach(([indexFileId, indexFile]) => {
      structuredFiles[indexFileId] = {
        indexFileId,
        ...indexFile,
        comment: decode(indexFile.comment),
        ...(indexFile.relation && {
          relation: decode(indexFile.relation),
        }),
        ...(indexFile.additional && {
          additional: decode(indexFile.additional),
        }),
        ...(indexFile.decryptionConditions && {
          decryptionConditions: decode(indexFile.decryptionConditions),
        }),
      };
    });

    structuredFiles &&
      Object.values(structuredFiles).forEach((structuredFile) => {
        const { contentId, contentType, controller } = structuredFile;
        if (
          streams[contentId] &&
          streams[contentId].controller === controller
        ) {
          streams[contentId] = {
            ...(!(contentType in IndexFileContentType) &&
              streams[contentId] && {
                content: streams[contentId],
              }),
            ...structuredFile,
          };
        }
      });
  }
  return streams;
};
