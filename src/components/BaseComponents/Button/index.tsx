import React, { ReactNode } from "react";
import { CSSProperties, FlattenSimpleInterpolation } from "styled-components";
import Loading from "../Loading";
import { ButtonContainerWrap } from "./style";

export interface ButtonType {
  type?: "primary" | "ghost" | "link" | "text" | "default" | "icon";
}
export interface ButtonProps extends ButtonType {
  width?: number | string;
  loading?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  css?: FlattenSimpleInterpolation;
}

const Button: React.FC<ButtonProps> = ({
  width = 80,
  type = "default",
  loading,
  children,
  onClick,
  css,
}) => {
  return (
    <ButtonContainerWrap
      width={width}
      type={type}
      onClick={() => {
        onClick?.();
      }}
      css={css}
    >
      {loading ? <Loading size={"small"} /> : children}
    </ButtonContainerWrap>
  );
};

export default Button;
