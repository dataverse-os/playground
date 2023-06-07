import Button from "@/components/BaseComponents/Button";
import { useAppDispatch, useSelector } from "@/state/hook";
import { identitySlice } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import styled, { css } from "styled-components";
import { Brand, HeaderRightRender, Wrapper, GitHubLink } from "./styled";
import githubLogo from "@/assets/github.png";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStream, useWallet } from "@/hooks";
import { Context } from "@/context";
// import { appName } from "@/sdk";

const Header = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {postModel} = useContext(Context);
  const { pkh, isConnectingIdentity } = useSelector((state) => state.identity);

  const {
    wallet,
    connectWallet,
    switchNetwork,
  } = useWallet();

  const {
    createCapability
  } = useStream(wallet);

  const handleClickSignin = async () => {
    try {
      dispatch(identitySlice.actions.setIsConnectingIdentity(true));
      await connectWallet();
      await switchNetwork(137);
      const pkh = await createCapability();
      dispatch(identitySlice.actions.setPkh(pkh))
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(identitySlice.actions.setIsConnectingIdentity(false));
    }
  }

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
          loading={isConnectingIdentity}
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
