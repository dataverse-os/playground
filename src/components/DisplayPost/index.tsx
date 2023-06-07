import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useMemo, useContext, useState } from "react";
import { postSlice } from "@/state/post/slice";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { useStream } from "@/hooks";
// import { appName, appVersion } from "@/sdk";
import { Model, PostStream } from "@/types";
import { Context } from "@/context";
import { detectDataverseExtension } from "@/utils";
import { ceramic, ceramicClient } from "@/sdk";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const { postModel, appVersion } = useContext(Context);
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
    streamRecord, 
    setStreamRecord,
    loadStream, 
    createPublicStream, 
    createPayableStream 
  } = useStream();

  useEffect(()=>{
    detectDataverseExtension().then((res)=>{
      console.log("hasExtension? :", res)
      setHasExtension(res);
    })
  }, [])

  useEffect(() => {
    if(postModel) {
      if(hasExtension === true) {
        loadStream({ modelId: postModel.stream_id });
      }
      else if(hasExtension === false) {
        console.log("start load by ceramic")
        loadStreamByCeramic();
      } else {
        // do nothing
      }
    }
  }, [postModel, hasExtension]);

  useEffect(() => {
    console.log("streamRecord changed:", streamRecord)
    const streamList: PostStream[] = [];
    Object.entries(streamRecord).forEach(([streamId, streamContent]) => {
      streamList.push({
        streamId,
        streamContent,
      });
    });
    console.log("streamList:", streamList)
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
    console.log("sortedList:", sortedList)
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }, [streamRecord]);

  const loadStreamByCeramic = async () => {
    const streams = await ceramic.loadStreamsByModel({
      model: postModel.stream_id,
      ceramic: ceramicClient,
    });
    console.log("streams load by ceramic:", streams)
    setStreamRecord(streams);
  }

  return (
    <>
      <Wrapper>
        <PublishPost
          createPublicStream={createPublicStream}
          createPayableStream={createPayableStream}
          loadStream={loadStream}
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
