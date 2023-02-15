import Button from "../Button";
import Textarea from "../Textarea";
import { Wrapper, ButtonWapper } from "./styled";
import { publishPost } from "@/state/post/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useState } from "react";

export interface PublishPostProps {}

const PublishPost: React.FC<PublishPostProps> = ({}) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  const [content, setContent] = useState("");

  return (
    <Wrapper>
      <Textarea
        height={250}
        onChange={(e) => {
          setContent(e.currentTarget.value);
        }}
      />
      <ButtonWapper>
        <Button
          onClick={() => {
            dispatch(publishPost({ did, content }));
          }}
        >
          Post
        </Button>
      </ButtonWapper>
    </Wrapper>
  );
};

export default PublishPost;
