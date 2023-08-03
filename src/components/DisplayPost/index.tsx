import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useMemo, useContext, useState } from "react";
import { postSlice } from "@/state/post/slice";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { PostStream, StreamRecordMap } from "@/types";
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
  // const [hasExtension, setHasExtension] = useState<boolean>();
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const isDataverseExtension = useSelector(
    (state) => state.noExtension.isDataverseExtension
  );
  const postListLeft = useMemo(() => {
    return postStreamList
      .map((post, index) => {
        if (index % 2 === 1) return post;
      })
      .filter((element) => {
        return element !== undefined;
      });
  }, [postStreamList]);
  const postListRight = useMemo(() => {
    return postStreamList
      .map((post, index) => {
        if (index % 2 === 0) return post;
      })
      .filter((element) => {
        return element !== undefined;
      });
  }, [postStreamList]);
  const dispatch = useAppDispatch();

  // const {
  //   streamsRecord,
  //   setStreamsRecord,
  //   loadStreams,
  //   createPublicStream,
  //   createPayableStream
  // } = useStream();
  const { createStream: createPublicStream } = useCreateStream({
    streamType: StreamType.Public,
  });
  const { createStream: createPayableStream } = useCreateStream({
    streamType: StreamType.Payable,
  });
  const { state } = useStore();

  const { loadFeeds } = useFeeds();
  const [ceramicStreamsMap, setCeramicStreamsMap] = useState<StreamRecordMap>({});

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
    const streamList: PostStream[] = [];
    let streamsMap: StreamRecordMap = {};
    if(!isDataverseExtension) {
      streamsMap = ceramicStreamsMap;
    } else {
      streamsMap = state.streamsMap;
    }
    Object.entries(streamsMap).forEach(([streamId, streamRecord]) => {
      if (
        streamRecord.streamContent.file &&
        streamRecord.streamContent.content
      ) {
        streamList.push({
          streamId,
          streamRecord,
        });
      }
    });
    const sortedList = streamList
      .filter(
        (el) =>
          el.streamRecord.streamContent.content?.appVersion === appVersion &&
          (el.streamRecord.streamContent.content.text ||
            (el.streamRecord.streamContent.content.images &&
              el.streamRecord.streamContent.content.images?.length > 0) ||
            (el.streamRecord.streamContent.content.videos &&
              el.streamRecord.streamContent.content.videos?.length > 0))
      )
      .sort(
        (a, b) =>
          Date.parse(b.streamRecord.streamContent.content.createdAt) -
          Date.parse(a.streamRecord.streamContent.content.createdAt)
      );
    console.log("sorted, sortedList:", sortedList);
    dispatch(postSlice.actions.setPostStreamList(sortedList));
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

    console.log("ceramicStreamsRecordMap:", ceramicStreamsRecordMap);

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
        <PublishPost
          createPublicStream={createPublicStream}
          createPayableStream={createPayableStream}
          loadStream={loadFeeds}
        />
        {postListLeft.map((postStream, index) => (
          <DisplayPostItem
            postStream={postStream!}
            key={postStream!.streamId}
          />
        ))}
      </Wrapper>
      <Wrapper>
        {postListRight.map((postStream, index) => (
          <DisplayPostItem
            postStream={postStream!}
            key={postStream!.streamId}
          />
        ))}
      </Wrapper>
    </>
  );
};

export default DisplayPost;
