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
        console.log("load stream with runtime-connector...")
        loadStreams({ modelId: postModel.stream_id });
      } else if(hasExtension === false) {
        console.log("load stream with ceramic...")
        loadStreamByCeramic();
      }
    }
  }, [postModel, hasExtension]);

  useEffect(() => {
    console.log("streamsRecord loaded:", streamsRecord)
    const streamList: PostStream[] = [];
    Object.entries(streamsRecord).forEach(([streamId, streamRecord]) => {
      if(streamRecord.streamContent.file && streamRecord.streamContent.content) {
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
    console.log("sorted, sortedList:", sortedList)
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }, [streamsRecord]);

  const loadStreamByCeramic = async () => {
    const postStreams = await ceramic.loadStreamsByModel(
      postModel.stream_id
    );
    console.log("[ceramic]postStreams:", Object.values(postStreams).length)
    const indexedFilesStreams = await ceramic.loadStreamsByModel(
      indexFilesModel.stream_id
    );
    console.log("[ceramic]indexedFilesStreams:", Object.values(indexedFilesStreams).length)
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

    console.log("ceramicStreamsRecord:", ceramicStreamsRecord)

    Object.values(indexedFilesStreams).forEach((file) => {
      if(ceramicStreamsRecord[file.contentId]) {
        ceramicStreamsRecord[file.contentId].streamContent.file = file;
      }
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
