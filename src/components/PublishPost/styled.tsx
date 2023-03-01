import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 80%;
  height: calc(100% - 80px);

  @media screen and (min-width: 1280px) {
    width: 65%;
  }

  @media screen and (min-width: 2048px) {
    width: 55%;
  }
`;

export const Title = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  margin: 20px 0;
`;

export const Content = styled.div`
  border: solid 2px black;
  border-radius: 20px;
  padding: 40px;
  height: calc(100% - 20vh);

  @media screen and (min-width: 1280px) {
    height: 45vh;
  }

`;

export const ButtonWapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
