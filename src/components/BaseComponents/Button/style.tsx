import { pixelProofing } from "@/utils";
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
      background-color: #007aff;
    `}

  // text
  ${(props) =>
    props.type === "text" &&
    css`
      color: black;
      background-color: white;
      border: none;
    `}

  // icon
  ${(props) =>
    props.type === "icon" &&
    css`
      width: 1.75rem;
      height: 1.75rem;
      min-width: 1.75rem;
      border: none;
      padding: 0;
    `}

  ${(props) =>
    props.type === "gray" &&
    css`
      background-color: #f8f7f7;
      padding: 0;
      height: 30px;
      border-radius: 6px;
    `}

  transition: box-shadow 0.1s;
  ${(props) => props.css}
  font-family: Poppins-SemiBold;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
`;
