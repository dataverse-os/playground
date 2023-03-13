import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayPostList } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";

export interface PublishPostProps { }

const DisplayPost: React.FC<PublishPostProps> = ({ }) => {
  const postList = useSelector((state) => state.post.postList);
  const did = useSelector((state) => state.identity.did);
  console.log(postList)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayPostList(did));
  }, [did]);

  return (
    <>
      {postList.map((stream, index) => (
        <DisplayPostItem stream={stream} key={uuid()} />
      ))}
    </>
  );
};

export default DisplayPost;
