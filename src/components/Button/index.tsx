import React, { ReactNode } from "react";
import { CSSProperties } from "styled-components";
import Loading from "../Loading";
import { ButtonContainerWrap } from "./style";

export interface ButtonType {
  type?: "primary" | "ghost" | "link" | "text" | "default";
}
export interface ButtonProps extends ButtonType {
  width?: number | string;
  loading?: boolean;
  children?: ReactNode;
  cssStyle?: any;
  onClick?: () => void;
  style?: CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  width = 80,
  type = "default",
  loading,
  children,
  onClick,
  style,
}) => {
  return (
    <ButtonContainerWrap
      width={width}
      type={type}
      onClick={() => {
        onClick?.();
      }}
      style={style}
    >
      {loading ? <Loading size={"small"} /> : children}
    </ButtonContainerWrap>
  );
};

export default Button;
