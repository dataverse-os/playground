import Button from "../Button";
import Textarea from "../Textarea";
import { Wrapper, ButtonWapper, Title, Content } from "./styled";
import { encryptPost, publishPost, postSlice } from "@/state/post/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useState } from "react";
import { displayDefaultFolder } from "@/state/folder/slice";
import { css } from "styled-components";
import { PostType } from "@/types";

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
    dispatch(
      encryptPost({
        did,
        postContent: {
          text: content,
          images: [],
          videos: [],
        },
      })
    );
  };

  const post = async () => {
    if (isPublishingPost) return;
    if (!did) {
      alert("Please connect identity first.");
      return;
    }
    await dispatch(
      publishPost({
        did,
        postContent: {
          text: content,
          images: [
            "https://bafybeifnmmziqbl5gr6tuhcfo7zuhlnm3x4utawqlyuoralnjeif5uxpwe.ipfs.dweb.link/src=http___img.jj20.com_up_allimg_4k_s_02_210925003609C07-0-lp.jpg&refer=http___img.jj20.webp",
          ],
          videos: [],
        },
        encryptedContent,
        litKit,
      })
    );
    dispatch(displayDefaultFolder(did));
  };

  return (
    <Wrapper>
      <Title>Social Stream</Title>
      <Content>
        <Textarea
          value={encryptedContent || content}
          placeholder="Write something"
          onChange={textareaOnChange}
          css={css`
            width: 100%;
            height: calc(100% - 50px);
          `}
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
