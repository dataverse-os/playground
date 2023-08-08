import Button from "@/components/BaseComponents/Button";
import { didAbbreviation } from "@/utils";
import { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper, GitHubLink } from "./styled";
import githubLogo from "@/assets/github.png";
import { useNavigate } from "react-router-dom";
import { useApp, useStore } from "@dataverse/hooks";
import { usePlaygroundStore } from "@/context";

const Header = (): React.ReactElement => {
  const {
    modelParser,
    isDataverseExtension,
    isConnecting,
    setNoExtensionModalVisible,
    setIsConnecting,
  } = usePlaygroundStore();

  const navigate = useNavigate();

  const { pkh } = useStore();

  const { connectApp } = useApp({
    onPending: () => {
      setIsConnecting(true);
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }
    },
    onError: (e) => {
      console.error(e);
      setIsConnecting(false);
    },
    onSuccess: () => {
      setIsConnecting(false);
    },
  });

  const handleClickSignin = () => connectApp({ appId: modelParser.appId });

  return (
    <Wrapper>
      <Brand
        onClick={() => {
          navigate("/");
        }}
      >
        Playground
      </Brand>
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
          loading={isConnecting}
          type="primary"
          onClick={handleClickSignin}
          css={css`
            min-width: 150px;
          `}
        >
          {didAbbreviation(pkh, 2) || "Sign in"}
        </Button>
      </HeaderRightRender>
    </Wrapper>
  );
};

export default Header;
