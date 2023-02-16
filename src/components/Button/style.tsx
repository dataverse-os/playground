import { pixelProofing } from "@/utils/pixelProofing";
import styled, { css } from "styled-components";

export const ButtonContainerWrap = styled.div<{
  width: number | string;
  type: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  appearance: auto;
  user-select: none;
  white-space: pre;
  text-align: center;
  box-sizing: border-box;
  border: solid 2px black;
  border-radius: 6px;
  white-space: nowrap;
  height: 40px;
  padding: 4px 15px;
  width: fit-content;
  min-width: ${(props) =>
    typeof props.width === "number"
      ? `${props.width}px`
      : pixelProofing(props.width)};

  // primary
  ${(props) =>
    props.type === "primary" &&
    css`
      color: rgb(255, 255, 255);
      background-color: black;
    `}

  // text
    ${(props) =>
    props.type === "text" &&
    css`
      color: black;
      background-color: white;
      border: none;
    `}

    transition: box-shadow 0.1s;

  :hover {
    ${(props) =>
      props.type !== "text" &&
      css`
        background-color: rgba(18, 19, 18, 0.04);
      `}
  }
`;
