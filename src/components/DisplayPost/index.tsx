import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useRef, useMemo, createRef } from "react";
import { displayPostList } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import { displayMyPosts } from "@/state/folder/slice";

export interface PublishPostProps { }

const DisplayPost: React.FC<PublishPostProps> = ({ }) => {
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const did = useSelector((state) => state.identity.did);
  const dispatch = useAppDispatch();
  const leftRef = useMemo(() => Array(postStreamList.length).fill(0).map(i => createRef<HTMLDivElement>()), [postStreamList])
  const rightRef = useMemo(() => Array(postStreamList.length).fill(0).map(i => createRef<HTMLDivElement>()), [postStreamList])

  useEffect(() => {
    dispatch(displayPostList());
  }, []);

  return (
    <>
      {postStreamList.map((postStream, index) => (
        <DisplayPostItem ref={index % 2 === 0 ? leftRef[index] : rightRef[index]} postStream={postStream} key={postStream.streamId} />
      ))}
    </>
  );
};

export default DisplayPost;
