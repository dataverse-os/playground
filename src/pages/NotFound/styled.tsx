import styled from "styled-components";

export const NotFoundWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .error-code {
    font-size: 56px;
    font-family: Lato-SemiBold;
    /* margin: auto; */
  }

  .error-message {
    font-size: 24px;
    font-family: Lato-Regular;
  }
`;