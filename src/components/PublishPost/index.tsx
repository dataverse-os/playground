import Textarea from "../BaseComponents/Textarea";
import { Wrapper, ButtonWapper, Title, Content } from "./styled";
import { encryptPost, publishPost, postSlice } from "@/state/post/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect, useState } from "react";
import { displayMyPosts } from "@/state/folder/slice";
import { css } from "styled-components";
import AccountStatus from "../AccountStatus";
import imgIcon from "@/assets/icons/img.svg";
import lockIcon from "@/assets/icons/lock.svg";
import { FlexRow } from "../App/styled";
import { PostType } from "@/types";
import Button from "../BaseComponents/Button";
import { privacySettingsSlice } from "@/state/privacySettings/slice";
import PrivacySettings from "../PrivacySettings";

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
          images: [
            "https://bafybeifnmmziqbl5gr6tuhcfo7zuhlnm3x4utawqlyuoralnjeif5uxpwe.ipfs.dweb.link/src=http___img.jj20.com_up_allimg_4k_s_02_210925003609C07-0-lp.jpg&refer=http___img.jj20.webp",
          ],
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
    dispatch(displayMyPosts(did));
  };

  const openPrivacySettings = () => {
    dispatch(privacySettingsSlice.actions.setModalVisible(true));
  };

  return (
    <Wrapper>
      <Content>
        <AccountStatus name={"test.eth"} avatar={""} />
        <Textarea
          value={encryptedContent || content}
          placeholder="what's happening?"
          onChange={textareaOnChange}
          width={"100%"}
          height={147}
        />
        <ButtonWapper>
          <FlexRow>
            <Button type="icon" width={"1.75rem"}>
              <img src={imgIcon} />
            </Button>
            <Button
              type="icon"
              width={"1.75rem"}
              css={css`
                margin-left: 26px;
              `}
              onClick={openPrivacySettings}
            >
              <img src={lockIcon} />
            </Button>
          </FlexRow>

          {/* <Button loading={isEncrypting} onClick={encrypt}>
            {isEncryptedSuccessfully ? "Encrypted" : "Encrypt"}
          </Button> */}
          <FlexRow>
            <Button
              type="primary"
              loading={isPublishingPost}
              onClick={post}
              width={"1.4375rem"}
              css={css`
                border-radius: 8px;
                padding: 0.3rem 2rem;
              `}
            >
              Post
            </Button>
          </FlexRow>
        </ButtonWapper>
      </Content>
      <PrivacySettings></PrivacySettings>
    </Wrapper>
  );
};

export default PublishPost;
