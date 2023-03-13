import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayPostList } from "@/state/post/slice";
import { ButtonWapper, Content, Wrapper } from "../PublishPost/styled";
import { css } from "styled-components";
import AccountStatus from "../AccountStatus";
import { FlexRow } from "../App/styled";
import Textarea from "../BaseComponents/Textarea";

export interface PublishPostProps { }

const DisplayPost: React.FC<PublishPostProps> = ({ }) => {
  const postList = useSelector((state) => state.post.postList);
  const did = useSelector((state) => state.identity.did);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayPostList(did));
  }, [did]);

  return (
    <Wrapper>
      <Content>
        <AccountStatus name={'test.eth'} avatar={""} />

      </Content>
    </Wrapper>
  );
};

export default DisplayPost;
