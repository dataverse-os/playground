import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
  margin: 0;
`;
