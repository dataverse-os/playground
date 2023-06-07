import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelInstanceDocument } from "@ceramicnetwork/stream-model-instance";
import { IndexApi, Page, StreamState } from "@ceramicnetwork/common";
import { decode } from "../utils";

class Ceramic {
  readonlyCeramic?: CeramicClient;

  loadStream({
    ceramic,
    streamId,
  }: {
    ceramic: CeramicClient;
    streamId: string;
  }): Promise<ModelInstanceDocument<any>> {
    return ModelInstanceDocument.load(ceramic, streamId);
  }

  async loadStreamsByModel({
    model,
    ceramic,
  }: {
    model: string;
    ceramic: CeramicClient;
  }): Promise<Record<string, any>> {
    let cursor: string | undefined;
    const chunkSize = 1000;
    const streams = {} as Record<string, any>;
    const index: IndexApi = ceramic.index;
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

  /**
   *
   * @returns A promise that returns a Read-Only CeramicClient
   */
  initReadonlyCeramic(): CeramicClient {
    if (!this.readonlyCeramic) {
      this.readonlyCeramic = new CeramicClient(process.env.CERAMIC_API);
    }
    return this.readonlyCeramic;
  }
}

export const ceramic = new Ceramic();
export const ceramicClient = ceramic.initReadonlyCeramic();