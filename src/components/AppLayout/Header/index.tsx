import Button from "@/components/BaseComponents/Button";
import { displayMyPosts } from "@/state/folder/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { connectIdentity } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper } from "./styled";


const Header = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { did, isConnectingIdentity } = useSelector((state) => state.identity);

  return (
    <Wrapper>
      <Brand>Playground</Brand>
      <HeaderRightRender>
        {/* <Button
          css={css`
            margin-right: -30px;
          `}
        >
          Home
        </Button>
        <Button
          css={css`
            margin-right: 12px;
          `}
        >
          My posts
        </Button> */}

        <Button
          loading={isConnectingIdentity}
          type="primary"
          onClick={() => {
            dispatch(connectIdentity());
          }}
          css={css`
            min-width: 150px;
          `}
        >
          {didAbbreviation(did, 2) || "Sign in"}
        </Button>
      </HeaderRightRender>
    </Wrapper>
  );
};

export default Header;
