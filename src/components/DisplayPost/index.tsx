import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useMemo, useContext, useState } from "react";
import { postSlice } from "@/state/post/slice";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { StreamRecordMap } from "@/types";
import { Context } from "@/context";
import { detectDataverseExtension } from "@dataverse/utils";
import { ceramic } from "@/sdk";
import { noExtensionSlice } from "@/state/noExtension/slice";
import {
  StreamType,
  useCreateStream,
  useFeeds,
  useStore,
} from "@dataverse/hooks";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost = () => {
  const { appVersion, modelParser } = useContext(Context);
  const postModel = useMemo(() => {
    return modelParser.getModelByName("post");
  }, []);
  const indexFilesModel = useMemo(() => {
    return modelParser.getModelByName("indexFiles");
  }, []);
  const dispatch = useAppDispatch();
  // const [hasExtension, setHasExtension] = useState<boolean>();
  const sortedStreamIds = useSelector((state) => state.post.sortedStreamIds);
  console.log({ sortedStreamIds });
  const isDataverseExtension = useSelector(
    (state) => state.noExtension.isDataverseExtension
  );
  const { state } = useStore();

  const { loadFeeds } = useFeeds();
  const [ceramicStreamsMap, setCeramicStreamsMap] = useState<StreamRecordMap>(
    {}
  );

  useEffect(() => {
    detectDataverseExtension().then((res) => {
      dispatch(noExtensionSlice.actions.setIsDataverseExtension(res));
    });
  }, []);

  useEffect(() => {
    if (postModel) {
      if (isDataverseExtension === true) {
        loadFeeds(postModel.streams[postModel.streams.length - 1].modelId);
      } else if (isDataverseExtension === false) {
        loadFeedsByCeramic();
      }
    }
  }, [postModel, isDataverseExtension]);

  useEffect(() => {
    console.log("state streamsMap changed...");
    const streamsMap: StreamRecordMap = isDataverseExtension
      ? state.streamsMap
      : ceramicStreamsMap;
    const sortedStreamsIds = Object.keys(streamsMap)
      .filter(
        (el) => streamsMap[el].streamContent.content.appVersion === appVersion
      )
      .sort(
        (a, b) =>
          Date.parse(streamsMap[b].streamContent.content.createdAt) -
          Date.parse(streamsMap[a].streamContent.content.createdAt)
      );
    dispatch(postSlice.actions.setSortedStreamIds(sortedStreamsIds));
  }, [Object.keys(state.streamsMap).length, ceramicStreamsMap]);

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
            <></>
          )
        )}
      </Wrapper>
      <Wrapper>
        {sortedStreamIds.map((streamId, index) =>
          index % 2 == 0 ? (
            <DisplayPostItem streamId={streamId} key={streamId} />
          ) : (
            <></>
          )
        )}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
