import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useRef, useMemo, createRef } from "react";
import { displayPostList } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import { displayMyPosts } from "@/state/folder/slice";
import PublishPost from "@/components/PublishPost";
import styled from "styled-components";

export interface PublishPostProps {}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* width: 48%; */
`;

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const postListLeft = postStreamList
    .map((post, index) => {
      if (index % 2 === 0) return post;
    })
    .filter((element) => {
      return element !== undefined;
    });
  const postListRight = postStreamList
    .map((post, index) => {
      if (index % 2 === 1) return post;
    })
    .filter((element) => {
      return element !== undefined;
    });
  const did = useSelector((state) => state.identity.did);
  const dispatch = useAppDispatch();
  const leftRef = useMemo(
    () =>
      Array(postStreamList.length)
        .fill(0)
        .map((i) => createRef<HTMLDivElement>()),
    [postStreamList]
  );
  const rightRef = useMemo(
    () =>
      Array(postStreamList.length)
        .fill(0)
        .map((i) => createRef<HTMLDivElement>()),
    [postStreamList]
  );

  useEffect(() => {
    dispatch(displayPostList());
  }, []);

  console.log({ postStreamList, postListLeft, postListRight });

  return (
    <>
      <Wrapper>
        <PublishPost />
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
