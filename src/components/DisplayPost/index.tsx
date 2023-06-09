import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useMemo, useContext, useState } from "react";
import { postSlice } from "@/state/post/slice";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { useStream } from "@/hooks";
// import { appName, appVersion } from "@/sdk";
import { Model, PostStream, StreamsRecord } from "@/types";
import { Context } from "@/context";
import { decode, detectDataverseExtension } from "@/utils";
import { ceramic } from "@/sdk";
import { IndexFileContentType, StructuredFiles } from "@dataverse/runtime-connector";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const { postModel, indexFilesModel, appVersion, output } = useContext(Context);
  const [hasExtension, setHasExtension] = useState<boolean>();
  const postStreamList = useSelector((state) => state.post.postStreamList);
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

  const { 
    streamsRecord, 
    setStreamsRecord,
    loadStreams, 
    createPublicStream, 
    createPayableStream 
  } = useStream();

  useEffect(()=>{
    detectDataverseExtension().then((res)=>{
      setHasExtension(res);
    })
  }, [])

  useEffect(() => {
    if(postModel) {
      if(hasExtension === true) {
        loadStreams({ modelId: postModel.stream_id });
      } else if(hasExtension === false) {
        loadStreamByCeramic();
      }
    }
  }, [postModel, hasExtension]);

  useEffect(() => {
    const streamList: PostStream[] = [];
    Object.entries(streamsRecord).forEach(([streamId, streamRecord]) => {
      streamList.push({
        streamId,
        streamRecord,
      });
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
    console.log("sorted, sortedList:", sortedList)
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }, [streamsRecord]);

  const loadStreamByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.stream_id
    );
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.stream_id
    );
    const ceramicStreamsRecord: StreamsRecord = {};
    Object.entries(postStreams).forEach(([streamId, content]) => {
      ceramicStreamsRecord[streamId] = {
        app: output.createDapp.name,
        modelId: postModel.stream_id,
        pkh: content.controller,
        streamContent: {
          content,
        }
      };
    })

    Object.values(indexedFilesStreams).forEach((file) => {
      ceramicStreamsRecord[file.contentId].streamContent.file = file;
    })

    setStreamsRecord(ceramicStreamsRecord);
  }

  return (
    <>
      <Wrapper>
        <PublishPost
          createPublicStream={createPublicStream}
          createPayableStream={createPayableStream}
          loadStream={loadStreams}
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
