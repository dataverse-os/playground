import { useEffect, useMemo, useContext, useState } from "react";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import { StreamRecordMap } from "@/types";
import { usePlaygroundStore } from "@/context";
import { detectDataverseExtension } from "@dataverse/utils";
import { ceramic } from "@/sdk";
import {
  StreamType,
  useCreateStream,
  useFeeds,
  useStore,
} from "@dataverse/hooks";
import { Wrapper } from "./styled";
import { FileType } from "@dataverse/dataverse-connector";

const DisplayPost = () => {
  const {
    modelParser,
    appVersion,
    isDataverseExtension,
    sortedStreamIds,
    setIsDataverseExtension,
    setSortedStreamIds,
  } = usePlaygroundStore();
  const postModel = useMemo(() => {
    return modelParser.getModelByName("post");
  }, []);
  const indexFilesModel = useMemo(() => {
    return modelParser.getModelByName("indexFiles");
  }, []);

  const { streamsMap } = useStore();
  const { loadFeeds } = useFeeds();
  const [ceramicStreamsMap, setCeramicStreamsMap] = useState<StreamRecordMap>(
    {}
  );

  useEffect(() => {
    detectDataverseExtension().then((res) => {
      setIsDataverseExtension(res);
      if (res === true) {
        console.log("load with extension");
        loadFeeds(postModel.streams[postModel.streams.length - 1].modelId);
      } else if (res === false) {
        console.log("load with ceramic");
        loadFeedsByCeramic();
      }
    });
  }, []);

  useEffect(() => {
    const _streamsMap: StreamRecordMap = isDataverseExtension
      ? streamsMap
      : ceramicStreamsMap;

    const _sortedStreamIds = Object.keys(_streamsMap)
      .filter(
        (el) =>
          _streamsMap[el].streamContent.content.appVersion === appVersion &&
          _streamsMap[el].streamContent.file.fileType !== FileType.Private
      )
      .sort(
        (a, b) =>
          Date.parse(_streamsMap[b].streamContent.content.createdAt) -
          Date.parse(_streamsMap[a].streamContent.content.createdAt)
      );

    setSortedStreamIds(_sortedStreamIds);
  }, [streamsMap, ceramicStreamsMap]);

  const loadFeedsByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.streams[postModel.streams.length - 1].modelId
    );
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.streams[postModel.streams.length - 1].modelId
    );
    const ceramicStreamsRecordMap: StreamRecordMap = {};
    Object.entries(postStreams).forEach(([streamId, content]) => {
      ceramicStreamsRecordMap[streamId] = {
        appId: modelParser.appId,
        modelId: postModel.streams[postModel.streams.length - 1].modelId,
        pkh: content.controller,
        streamContent: {
          content,
        },
      };
    });

    Object.values(indexedFilesStreams).forEach((file) => {
      if (ceramicStreamsRecordMap[file.contentId]) {
        ceramicStreamsRecordMap[file.contentId].streamContent.file = file;
      }
    });

    setCeramicStreamsMap(ceramicStreamsRecordMap);
  };

  const { isPending: isPublicPending, createStream: createPublicStream } =
    useCreateStream({
      streamType: StreamType.Public,
    });

  const { isPending: isPayablePending, createStream: createPayableStream } =
    useCreateStream({
      streamType: StreamType.Payable,
    });

  return (
    <>
      <Wrapper>
        <PublishPost
          modelId={postModel.streams[postModel.streams.length - 1].modelId}
          isPending={isPublicPending || isPayablePending}
          createPublicStream={createPublicStream}
          createPayableStream={createPayableStream}
        />
        {sortedStreamIds.map((streamId, index) =>
          index % 2 == 1 ? (
            <DisplayPostItem streamId={streamId} key={streamId} />
          ) : (
            undefined
          )
        )}
      </Wrapper>
      <Wrapper>
        {sortedStreamIds.map((streamId, index) =>
          index % 2 == 0 ? (
            <DisplayPostItem streamId={streamId} key={streamId} />
          ) : (
            undefined
          )
        )}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
