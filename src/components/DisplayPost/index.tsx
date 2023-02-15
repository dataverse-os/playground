import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayPostList } from "@/state/post/slice";
import { Wrapper, PostWapper } from "./styled";

export interface PublishPostProps {}

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const postList = useSelector((state) => state.post.postList);
  const did = useSelector((state) => state.identity.did);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayPostList(did));
  }, [did]);

  return (
    <Wrapper>
      {postList.map((post, index) => (
        <PostWapper key={post?.streamId} marginTop={index === 0 ? 0 : 24}>
          {post?.streamContent?.content?.content ||
            post?.streamContent?.content}
        </PostWapper>
      ))}
    </Wrapper>
  );
};

export default DisplayPost;
