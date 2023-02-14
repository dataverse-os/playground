import React, { ReactNode } from "react";
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
}

const Button: React.FC<ButtonProps> = ({
  width = 80,
  type = "default",
  loading,
  children,
  onClick,
}) => {
  return (
    <ButtonContainerWrap
      width={width}
      type={type}
      onClick={() => {
        onClick?.();
      }}
    >
      {loading ? <Loading /> : children}
    </ButtonContainerWrap>
  );
};

export default Button;
