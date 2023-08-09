import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelInstanceDocument } from "@ceramicnetwork/stream-model-instance";
import { IndexApi, Page, StreamState } from "@ceramicnetwork/common";
import { decode } from "../utils";
import {
  IndexFileContentType,
  StructuredFiles,
} from "@dataverse/dataverse-connector";

class Ceramic {
  public ceramicClient: CeramicClient;

  constructor() {
    this.ceramicClient = new CeramicClient(process.env.CERAMIC_API);
  }

  public loadStream({
    ceramic,
    streamId,
  }: {
    ceramic: CeramicClient;
    streamId: string;
  }): Promise<ModelInstanceDocument<any>> {
    return ModelInstanceDocument.load(ceramic, streamId);
  }

  public async loadStreamsByModel(model: string): Promise<Record<string, any>> {
    let cursor: string | undefined;
    const chunkSize = 1000;
    const streams = {} as Record<string, any>;
    const index: IndexApi = this.ceramicClient.index;
    do {
      const indexFolderResponse: Page<StreamState> = await (!cursor
        ? index.queryIndex({
            model: model,
            last: chunkSize,
          })
        : index.queryIndex({
            model: model,
            last: chunkSize,
            before: cursor,
          }));
      for (const edge of indexFolderResponse.edges) {
        const streamId: string = decode(edge.cursor)["stream_id"];
        if (edge.node.metadata.model == null) {
          continue;
        }
        streams[streamId] = {
          ...edge.node.content,
          controller: edge.node.metadata.controllers[0],
        };
      }

      const { hasPreviousPage, startCursor } = indexFolderResponse.pageInfo;
      if (hasPreviousPage) {
        cursor = startCursor;
      } else {
        cursor = undefined;
      }
    } while (cursor);
    // pro
    return streams;
  }

  public async buildStreamsWithFiles({
    model,
    streams,
  }: {
    model: string;
    streams: Record<string, any>;
  }) {
    const indexFiles = await this.loadStreamsByModel(model);

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
      Object.values(structuredFiles).forEach(structuredFile => {
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
    return streams;
  }
}

export const ceramic = new Ceramic();
