import React, { useRef } from "react";

import { FlattenSimpleInterpolation } from "styled-components";

import { InputBox } from "./styled";

export interface InputProps {
  width?: number | string;
  height?: number | string;
  value?: string;
  center?: boolean;
  fontSize?: string;
  placeholder?: string;
  content?: React.MutableRefObject<string>;
  readOnly?: boolean;
  css?: FlattenSimpleInterpolation;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => void;
}

/**
 * A ez way to handle input correctly
 * @param placeholder {string} 默认占位符
 * @param content {string} 默认值
 * @returns
 */
const Textarea: React.FC<InputProps> = ({
  height = 500,
  width = 500,
  center = false,
  fontSize = 24,
  placeholder,
  content,
  value,
  readOnly = false,
  css,
  onChange,
  onKeyDown,
  onBlur,
  onClick,
}) => {
  const _content = useRef<string>("");
  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    _content.current = e.currentTarget.value;
    if (content) {
      content.current = e.currentTarget.value;
    }
  };
  return (
    <InputBox
      width={width}
      height={height}
      center={center}
      fontSize={fontSize}
      placeholder={placeholder}
      value={value}
      readOnly={readOnly}
      css={css}
      onInput={handleChange}
      onChange={onChange}
      onBlur={onBlur}
      onClick={onClick}
      onKeyDown={onKeyDown}
      autoFocus
    />
  );
};

export default Textarea;
