import Button from "@/components/BaseComponents/Button";
import { displayMyPosts } from "@/state/folder/slice";
import { useAppDispatch, useSelector } from "@/state/hook";
import { connectIdentity } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper } from "./styled";

const Header = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

  return (
    <Wrapper>
      <Brand>Playground</Brand>
      <HeaderRightRender>
        <Button
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
        </Button>

        <Button
          type="primary"
          onClick={() => {
            dispatch(connectIdentity());
            
          }}
        >
          {"Sign in"}
          {/*didAbbreviation(did) || "Sign in" */}
        </Button>
      </HeaderRightRender>
    </Wrapper>
  );
};

export default Header;
