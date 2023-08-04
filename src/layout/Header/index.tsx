import Button from "@/components/BaseComponents/Button";
import { didAbbreviation } from "@/utils";
import { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper, GitHubLink } from "./styled";
import githubLogo from "@/assets/github.png";
import { useNavigate } from "react-router-dom";
import { useApp, useStore } from "@dataverse/hooks";
import { usePlaygroundStore } from "@/context";
// import { Context } from "@/context";

const Header = (): React.ReactElement => {
  // const { modelParser } = useContext(Context);
  const {
    playgroundState: { modelParser, isDataverseExtension },
    setNoExtensionModalVisible,
  } = usePlaygroundStore();
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { pkh, isConnectingIdentity } = useSelector((state) => state.identity);
  // const isDataverseExtension = useSelector(
  //   (state) => state.noExtension.isDataverseExtension
  // );

  const { state } = useStore();

  const { isPending, connectApp } = useApp({
    onError: (e) => {
      console.error(e);
    },
  });

  const handleClickSignin = async () => {
    if (isDataverseExtension === false) {
      // dispatch(noExtensionSlice.actions.setModalVisible(true));
      setNoExtensionModalVisible(true);
      return;
    }
    connectApp({ appId: modelParser.appId });
  };

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
          loading={isPending}
          type="primary"
          onClick={handleClickSignin}
          css={css`
            min-width: 150px;
          `}
        >
          {didAbbreviation(state.pkh, 2) || "Sign in"}
        </Button>
      </HeaderRightRender>
    </Wrapper>
  );
};

export default Header;
