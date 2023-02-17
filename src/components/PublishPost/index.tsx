import Button from "../Button";
import Textarea from "../Textarea";
import { Wrapper, ButtonWapper, Title, Content } from "./styled";
import { encryptPost, publishPost, postSlice } from "@/state/post/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useState } from "react";
import { displayDefaultFolder } from "@/state/folder/slice";

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
    dispatch(encryptPost({ did, content }));
  };

  const post = async () => {
    if (isPublishingPost) return;
    await dispatch(publishPost({ did, content, encryptedContent, litKit }));
    dispatch(displayDefaultFolder(did));
  };

  return (
    <Wrapper>
      <Title>Social Stream</Title>
      <Content>
        <Textarea
          value={encryptedContent || content}
          width={300}
          height={300}
          placeholder="Write something"
          onChange={textareaOnChange}
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
