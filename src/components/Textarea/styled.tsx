import { pixelProofing } from "@/utils/pixelProofing";
import styled from "styled-components";

export const InputBox = styled.textarea<{
  height: number | string;
  width: number | string;
  center: boolean;
  fontSize: number | string;
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
  background: rgb(248, 247, 247);
  border-radius: 6px;
  resize: none;
  padding: 10px;
  border: none;
  outline: none;
  white-space: nowrap;
  
`;
