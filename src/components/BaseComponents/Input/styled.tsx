import { pixelProofing } from "@/utils/pixelProofing";
import styled, { FlattenSimpleInterpolation } from "styled-components";

export const Wrapper = styled.div<{ cssStyles?: FlattenSimpleInterpolation }>`
  display: flex;
  align-items: center;
  width: 100%;
  ${(props) => props.cssStyles}
`;

export const InputBox = styled.input<{
  canBeEmpty: boolean;
  value: string;
  reg?: RegExp;
  regCheck: boolean;
  positive: boolean;
  cssStyles?: FlattenSimpleInterpolation;
}>`
  width: 100%;
  background: #f8f7f7;
  border-radius: 6px;
  font-size: 0.75rem;
  line-height: 0.75rem;
  padding: 5px 10px;
  transition: all 0.3s;
  outline: 0;
  &::placeholder {
    color: #c5c5c5;
  }
  ${(props) =>
    (!props.canBeEmpty && props.value === "") ||
    (props.reg && !props.regCheck) ||
    (props.positive && parseFloat(props.value) <= 0)
      ? "border: 1px solid #ff4d4f"
      : "border: 1px solid #fff"};
  ${(props) => props.cssStyles}
`;
