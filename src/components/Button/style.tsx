import { pixelProofing } from "@/utils/pixelProofing";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

export const ButtonContainerWrap = styled.div<{
  width: number | string;
  type: string;
  css?: FlattenSimpleInterpolation;
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
  border-radius: 10px;
  white-space: nowrap;
  height: 45px;
  padding: 12px 42px;
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
      background-color: #007AFF;
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
  ${(props) => props.css}
`;
