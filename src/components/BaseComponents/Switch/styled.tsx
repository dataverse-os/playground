import { pixelProofing } from "@/utils/pixelProofing";
import styled, { FlattenSimpleInterpolation } from "styled-components";

export const SwitchButton = styled.button<{
  size: string;
  checked?: boolean;
}>`
  margin: 0;
  padding: 0;
  color: #000000d9;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  min-width: 44px;
  height: 22px;
  line-height: 22px;
  vertical-align: middle;
  background-color: ${(props) => (props.checked ? "#1890ff" : "#00000040")};
  border: 0;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  ${(props) =>
    props.size === "small" &&
    `
        min-width: 28px;
        height: 16px;
        line-height: 16px;
        `}
`;

export const SwitchDot = styled.div<{
  size: string;
  checked?: boolean;
  checkedLeft?: string;
}>`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.checked ? props.checkedLeft : "2px")};
  width: 18px;
  height: 18px;
  ${(props) =>
    props.size === "small" &&
    `
          width: 12px;
          height: 12px;
          `}
  transition: all 0.2s ease-in-out;
  &:before {
    position: absolute;
    inset: 0;
    background-color: #fff;
    border-radius: 9px;
    box-shadow: 0 2px 4px #00230b33;
    transition: all 0.2s ease-in-out;
    content: "";
  }
`;
