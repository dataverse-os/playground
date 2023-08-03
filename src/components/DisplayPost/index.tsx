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
  useApp,
  useCreateStream,
  useFeeds,
  useStore,
  useWallet,
} from "@dataverse/hooks";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const { postModel, indexFilesModel, appVersion, modelParser } =
    useContext(Context);
  const dispatch = useAppDispatch();
  // const [hasExtension, setHasExtension] = useState<boolean>();
  const sortedStreamsMap = useSelector((state) => state.post.sortedStreamsMap);
  console.log({ sortedStreamsMap });
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
    if (postModel && state.dataverseConnector) {
      console.log("state.dataverseConnector:", state.dataverseConnector);
      if (isDataverseExtension === true) {
        console.log("load stream with dataverse-connector...");
        loadFeeds(postModel.streams[postModel.streams.length - 1].modelId);
      } else if (isDataverseExtension === false) {
        console.log("load stream with ceramic...");
        loadFeedsByCeramic();
      }
    }
  }, [state.dataverseConnector, postModel, isDataverseExtension]);

  useEffect(() => {
    console.log("streamsMap changed...");
    const streamsMap: StreamRecordMap = isDataverseExtension
      ? state.streamsMap
      : ceramicStreamsMap;
    const sortedStreamsMap = Object.entries(streamsMap)
      .filter(([, el]) => el.streamContent.content.appVersion === appVersion)
      .sort(
        ([, a], [, b]) =>
          Date.parse(b.streamContent.content.createdAt) -
          Date.parse(a.streamContent.content.createdAt)
      )
      .reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {}
      ) as StreamRecordMap;
    console.log("sortedStreamsMap:", sortedStreamsMap);
    dispatch(postSlice.actions.setSortedStreamsMap(sortedStreamsMap));
  }, [state.streamsMap, ceramicStreamsMap]);

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

  return (
    <>
      <Wrapper>
        <PublishPost />
        {Object.keys(sortedStreamsMap || {}).map((streamId, index) =>
          index % 2 == 1 ? (
            <DisplayPostItem
              streamRecord={sortedStreamsMap[streamId]}
              streamId={streamId}
              key={streamId}
            />
          ) : (
            <></>
          )
        )}
      </Wrapper>
      <Wrapper>
        {Object.keys(sortedStreamsMap || {}).map((streamId, index) =>
          index % 2 == 0 ? (
            <DisplayPostItem
              streamRecord={sortedStreamsMap[streamId]}
              streamId={streamId}
              key={streamId}
            />
          ) : (
            <></>
          )
        )}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
