import { css } from "styled-components";

export const modelWrapper = css`
  .footerContainer {
    display: none;
  }
  .header {
    display: flex;
    align-items: center;
    line-height: 19px;
    .icon {
      width: 20px;
      margin-right: 8px;
    }
  }
  .title {
  }
  .tip {
    color: #aeb0b2;
    font-size: 12px;
    margin-top: 10px;
    font-family: Poppins;
  }
`;

export const inputStyle = css`
  margin-top: 10px;
  width: 100%;
  height: 42px;
  > input {
    font-family: Poppins;
    font-size: 16px;
    &::placeholder {
      font-family: Poppins;
    }
  }
`;

export const buttonStyle = css`
  margin: 20px auto 0;
  background-color: #845eee;
`;
