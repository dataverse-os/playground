import { css } from "styled-components";

export const modelWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 421px;
  .footerContainer {
    display: none;
  }
  .header {
    .icon {
      width: 60px;
      margin-right: 8px;
    }
    .title {
      font-family: Poppins-Medium;
    }
  }
  .body {
    margin-top: 30px;
    margin-left: 27%;
    .title {
      text-align: left;
      font-size: 18px;
      font-family: Poppins-SemiBold;
    }
    .desc {
      margin-top: 5px;
      font-family: Poppins;
      font-size: 14px;
      text-align: left;
    }
  }
`;

export const buttonStyle = css`
  width: 137px;
  height: 40px;
  margin: 30px auto 0;
`;
