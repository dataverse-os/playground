import Button from "../Button";
import Textarea from "../Textarea";
import { Wrapper, ButtonWapper, Title, Content } from "./styled";
import { encryptPost, publishPost, postSlice } from "@/state/post/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useState } from "react";
import { displayDefaultFolder } from "@/state/folder/slice";
import { css } from "styled-components";

export interface PublishPostProps {}

const PublishPost: React.FC<PublishPostProps> = ({}) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  const encryptedContent = useSelector((state) => state.post.encryptedContent);
  const isEncrypting = useSelector((state) => state.post.isEncrypting);
  const isEncryptedSuccessfully = useSelector(
    (state) => state.post.isEncryptedSuccessfully
  );
  const isPublishingPost = useSelector((state) => state.post.isPublishingPost);
  const litKit = useSelector((state) => state.post.litKit);
  const [content, setContent] = useState("");

  const textareaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
    dispatch(postSlice.actions.clearEncryptedState());
  };

  const encrypt = async () => {
    if (isEncrypting || isEncryptedSuccessfully) return;
    if (!did) {
      alert("Please connect identity first.");
      return;
    }
    dispatch(encryptPost({ did, content }));
  };

  const post = async () => {
    if (isPublishingPost) return;
    if (!did) {
      alert("Please connect identity first.");
      return;
    }
    await dispatch(publishPost({ did, content, encryptedContent, litKit }));
    dispatch(displayDefaultFolder(did));
  };

  return (
    <Wrapper>
      <Content>
        <Textarea
          value={encryptedContent || content}
          placeholder="what's happening?"
          onChange={textareaOnChange}
          width={'100%'}
          height={147}
        />
        <ButtonWapper>
          <Button loading={isEncrypting} onClick={encrypt}>
            {isEncryptedSuccessfully ? "Encrypted" : "Encrypt"}
          </Button>
          <Button loading={isPublishingPost} onClick={post}>
            Publish a post
          </Button>
        </ButtonWapper>
      </Content>
    </Wrapper>
  );
};

export default PublishPost;
