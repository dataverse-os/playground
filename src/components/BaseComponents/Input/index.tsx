import { useEffect, useRef, useState } from "react";
import { FlattenSimpleInterpolation } from "styled-components";
import { checkUniqueChar, decimalPlacesLimit } from "./string";
import { InputBox, Wrapper } from "./styled";

interface InputProps {
  value?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onKeyDown?: (...args: any) => any;
  onBlur?: (...args: any) => any;
  onClick?: (...args: any) => any;
  canBeEmpty?: boolean;
  reg?: RegExp;
  decimalPlaces?: number;
  positive?: boolean;
  cssStyles?: FlattenSimpleInterpolation;
}

const Input = function ({
  value,
  placeholder,
  type = "text",
  min = 0,
  readOnly = false,
  onChange,
  onKeyDown,
  onBlur,
  onClick,
  canBeEmpty = true,
  reg,
  decimalPlaces,
  positive = false,
  cssStyles,
}: InputProps) {
  const [currentValue, setCurrentValue] = useState(value || "");
  const [regCheck, setRegCheck] = useState(false);
  const validKey = useRef(true);
  useEffect(() => {
    if (value === undefined) return;
    onChange?.(value || "");
    setCurrentValue(value || "");
  }, [onChange, value]);

  useEffect(() => {
    if (reg) {
      setRegCheck(!!currentValue);
      if (reg) {
        setRegCheck(reg.test(currentValue));
      }
      setCurrentValue(currentValue);
      onChange?.(currentValue);
    }
  }, [reg]);
  // useEffect(() => {
  //   console.log(currentValue, typeof currentValue, reg, reg?.test(currentValue));
  // }, [currentValue]);
  return (
    <Wrapper cssStyles={cssStyles}>
      <InputBox
        value={currentValue}
        placeholder={placeholder}
        type={type}
        min={min}
        readOnly={readOnly}
        onChange={event => {
          if (type === "number" && event.currentTarget.value !== "") {
            event.currentTarget.value = checkUniqueChar(
              event.currentTarget.value.match(/[0-9|.]+/)?.[0] || currentValue,
              ".",
            );
            if (
              decimalPlaces !== undefined &&
              !decimalPlacesLimit(event.currentTarget.value, decimalPlaces)
            ) {
              event.currentTarget.value = currentValue;
            }
          }
          if (reg) {
            setRegCheck(reg.test(event.currentTarget.value));
          }
          setCurrentValue(event.currentTarget.value);
          onChange?.(event.currentTarget.value);
        }}
        onKeyDown={event => {
          if (
            (type === "number" && event.key === "+") ||
            event.key === "-" ||
            event.key === "e" ||
            (event.key === "." && decimalPlaces === 0)
          ) {
            validKey.current = false;
          } else {
            validKey.current = true;
            onKeyDown?.(event.currentTarget.value);
          }
        }}
        onInput={event => {
          if (type === "number" && !validKey.current) {
            event.currentTarget.value = currentValue;
          }
        }}
        onBlur={event => onBlur?.(event.currentTarget.value)}
        onClick={event => onClick?.(event)}
        canBeEmpty={canBeEmpty}
        reg={reg}
        regCheck={regCheck}
        positive={positive}
        cssStyles={cssStyles}
      />
    </Wrapper>
  );
};
export default Input;
