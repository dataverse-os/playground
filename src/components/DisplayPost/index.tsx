import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayPostList } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import { displayMyPosts } from "@/state/folder/slice";

export interface PublishPostProps {}

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const did = useSelector((state) => state.identity.did);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayPostList());
  }, [did]);
  console.log({ postStreamList });
  return (
    <>
      {postStreamList.map((postStream, index) => (
        <DisplayPostItem postStream={postStream} key={postStream.streamId} />
      ))}
    </>
  );
};

export default DisplayPost;
