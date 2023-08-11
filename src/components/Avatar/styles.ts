import { motion } from "framer-motion";
import styled from "styled-components";

export const AvatarContainer = styled.div<{ haveContextMenu: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  cursor: ${props => (props.haveContextMenu ? "pointer" : null)};
  &:hover {
    > div {
      visibility: ${props => (props.haveContextMenu ? "visible" : null)};
    }
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarContextMenuTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 19px;
  margin-left: 10px;
  margin-bottom: 5px;
`;

export const AvatarContextMenuContainer = styled(motion.div)<{
  visible: boolean;
}>`
  width: 90%;
  min-height: 361px;
  left: 5%;
  top: 8%;
  padding: 10px 0;
  position: fixed;
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.25);
  display: ${props => (props.visible ? "" : "none")};
  border-radius: 16px;
  z-index: 1000;
`;

export const AvatarContextMenuUserProfile = styled.div`
  height: 128px;
  overflow: auto;
`;

export const AvatarContextMenuBottom = styled.div`
  bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`;

export const AvatarContextBtnContainer = styled.div`
  background: #ffffff;
  /* border-radius: 8px; */
  position: relative;
  &:hover {
    /* box-shadow: 0px 2px 13px rgba(0, 0, 0, 0.12); */
    background-color: #d6d9dc;
  }
  transition: all 0.2s;
  height: 40px;
  align-items: center;
  display: flex;
`;

export const AvatarContextBtnIcon = styled.img`
  margin: 0 15px;
  width: 18px;
  height: 18px;
`;

export const AvatarContextBtnTextContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AvatarContextBtnText = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
`;

export const AvatarContextBtnSubText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 7px;
  line-height: 10px;
`;

export const AvatarContextBtnRightContent = styled.div`
  position: absolute;
  right: 20px;
`;

export const DefaultAvatarImg = styled.div`
  width: 100%;
  height: 100%;
  background: conic-gradient(
    from 105.11deg at 50% 50%,
    #8f94bf 0deg,
    #fde8e9 75deg,
    #8f94bf 360deg
  );
  border-radius: 50%;
  object-fit: cover;
  box-shadow:
    -6px -6px 12px rgba(255, 255, 255, 0.04),
    6px 6px 12px rgba(0, 0, 0, 0.16);
`;

export const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
