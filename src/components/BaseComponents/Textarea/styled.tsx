import { pixelProofing } from "@/utils";
import styled, { FlattenSimpleInterpolation } from "styled-components";

export const InputBox = styled.textarea<{
  height: number | string;
  width: number | string;
  center: boolean;
  fontSize: number | string;
  css?: FlattenSimpleInterpolation;
}>`
  width: ${(props) =>
    typeof props.width === "number"
      ? `${props.width}px`
      : pixelProofing(props.width)};
  height: ${(props) =>
    typeof props.height === "number"
      ? `${props.height}px`
      : pixelProofing(props.height)};
  text-align: ${(props) => props.center && "center"};
  font-size: ${(props) =>
    typeof props.fontSize === "number"
      ? `${props.fontSize}px`
      : pixelProofing(props.fontSize)};
  line-height: ${(props) =>
    typeof props.fontSize === "number"
      ? `${props.fontSize}px`
      : pixelProofing(props.fontSize)};
  box-sizing: border-box;
  background: #F6F6F6;
  border-radius: 6px;
  resize: none;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  word-break: break-all;
  font-family: Poppins-SemiBold;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: #999999;

  ${(props) => props.css}
`;
