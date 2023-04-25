import React from "react";
import styled from "styled-components";

const NotFoundWrapper = styled.div`
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

export default function NotFound() {
  return (
    <NotFoundWrapper>
      <div className="error-code">404</div>
      <div className="error-message">Page not found</div>
    </NotFoundWrapper>
  );
}
