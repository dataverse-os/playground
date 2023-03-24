import Button from "@/components/BaseComponents/Button";
import { useAppDispatch, useSelector } from "@/state/hook";
import { connectIdentity } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import styled, { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper } from "./styled";
import githubLogo from "@/assets/github.png";

const GitHubLink = styled.img`
  height: 36px;
  width: 36px;
  margin-right: 10px;
  cursor: pointer;
`;

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
        <GitHubLink
          src={githubLogo}
          onClick={() => {
            window.open("https://github.com/dataverse-os/playground");
          }}
        />
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
