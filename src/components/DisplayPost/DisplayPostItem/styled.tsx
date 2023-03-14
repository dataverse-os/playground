import { pixelProofing } from "@/utils/pixelProofing";
import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 100%;
  width: calc(50% - 0.6875rem);
  margin: 0.35rem;
  &:nth-child(2n + 1) {
    order: 1;
  }
  &:nth-child(2n) {
    order: 2;
  }
`;

export const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-wrap: break-word;
  font-family: Poppins-SemiBold;
  font-style: normal;
  font-weight: 500;
  font-size: 0.96rem;
  line-height: 1.85rem;
  margin-left: 0.57rem;
  color: #000000;
`
  

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
  margin-top: ${(props) =>
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
  color: #007AFF;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
`;
