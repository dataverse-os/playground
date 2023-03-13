import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayPostList } from "@/state/post/slice";
import { uuid } from "@/utils/uuid";
import DisplayPostItem from "./DisplayPostItem";
import { displayMyPosts } from "@/state/folder/slice";

export interface PublishPostProps { }

const DisplayPost: React.FC<PublishPostProps> = ({ }) => {
  const posts = useSelector((state) => state.folder.posts);
  const did = useSelector((state) => state.identity.did);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayPostList(did));
    dispatch(displayMyPosts(did));
  }, [did]);

  return (
    <>
      {posts.map((mirror, index) => (
        <DisplayPostItem mirror={mirror} key={'mirror' + index} />
      ))}
    </>
  );
};

export default DisplayPost;
