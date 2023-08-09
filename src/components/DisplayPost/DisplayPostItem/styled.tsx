import { pixelProofing } from "@/utils";
import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 0.35rem;
`;

export const Content = styled.div`
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 0 26px 26px;
  padding-bottom: 21px;
  max-width: calc(100% - 3.35rem);
`;

export const PostWapper = styled.div<{ marginTop: number | string }>`
  display: flex;
  flex-direction: column;
  margin-top: ${props =>
    typeof props.marginTop === "number"
      ? `${props.marginTop}px`
      : pixelProofing(props.marginTop)};
  width: calc(100% - 70px);
  padding: 27px 34px;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
`;

export const CreatedAt = styled.div`
  white-space: nowrap;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1rem;
  margin: 0 1rem;
  color: #007aff;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
`;

export const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 20px;
  .link {
    font-family: Poppins-Medium;
    color: black;
  }
`;
