import { pixelProofing } from "@/utils/pixelProofing";
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
`;

export const Title = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin: 20px 0;
`;

export const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 50%;
  height: 40vh;
  margin: auto;
  padding: 40px;
  overflow-y: auto;
  border: solid 2px black;
  border-radius: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PostWapper = styled.div<{ marginTop: number | string }>`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) =>
    typeof props.marginTop === "number"
      ? `${props.marginTop}px`
      : pixelProofing(props.marginTop)};
  /* width: 400px; */
  padding: 27px 34px;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  word-break: break-all;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
export const LinkWrapper = styled.a`
  /* position: absolute;
  top: 0;
  left: 0;
  right: 0; */
  margin: auto;
  display: flex;
  justify-content: center;
`;

export const Link = styled.a`
  font-size: 24px;
  
`;
