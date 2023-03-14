import styled, { FlattenSimpleInterpolation } from "styled-components";

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

export const Title = styled.div<{ cssStyles?: FlattenSimpleInterpolation }>`
  font-size: 24px;
  font-weight: 500;
  margin: 20px 0;
  font-size: 0.875rem;
  line-height: 1.3125rem;
  ${(props) => props.cssStyles}
`;

export const Content = styled.div`
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
  padding: 27px 26px;
  padding-bottom: 21px;
  max-width: calc(100% - 3.35rem);
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  justify-items: center;
  align-items: center;
`;

export const UploadImg = styled.img`
  height: 25%;
  width: 25%;
  cursor: pointer;
`

export const UploadImgWrap = styled.div`
  
`