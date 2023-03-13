import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 100%;
  width: calc(50% - 0.6875rem);
  &:nth-child(2n+1) {order: 1;}
  &:nth-child(2n) {order: 2;}
`;

export const Title = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin: 20px 0;
`;

export const Content = styled.div`
  background: #FFFFFF;
  border: 1px solid #E9E9E9;
  border-radius: 12px;
  padding: 27px 26px;
  padding-bottom: 21px;
  max-width: calc(50vw - 3.35rem);
`;

export const ButtonWapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  justify-items: center;
  align-items: center;
`;
