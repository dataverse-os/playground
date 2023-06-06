import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useRef, useMemo, createRef, useState } from "react";
import { postSlice } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";
import { useModel, useStream } from "@/hooks";
import { appName, appVersion } from "@/sdk";
import { Model, PostStream } from "@/types";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const pkh = useSelector((state) => state.identity.pkh);
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

  const { streamRecord, loadStream, createPublicStream, createPayableStream } =
    useStream(appName);

  const { postModel } = useModel();

  useEffect(() => {
    loadStream({ modelId: postModel.modelId });
  }, [postModel]);

  useEffect(() => {
    const streamList: PostStream[] = [];
    Object.entries(streamRecord).forEach(([streamId, streamContent]) => {
      streamList.push({
        streamId,
        streamContent,
      });
    });
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
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }, [streamRecord]);

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
