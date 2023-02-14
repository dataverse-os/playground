import { useState } from "react";
import Button from "../Button";
import { Wrapper, PostWapper } from "./styled";

export interface PublishPostProps {}

const DisplayPost: React.FC<PublishPostProps> = ({}) => {
  const [postList, setPostList] = useState([
    1, 2, 2, 2, 2, 2, 2, 22, 2, 2, 2, 2, 22, 2,
  ]);
  return (
    <Wrapper>
      {postList.map((post) => (
        <PostWapper>Post</PostWapper>
      ))}
    </Wrapper>
  );
};

export default DisplayPost;
