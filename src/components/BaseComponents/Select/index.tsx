import React, { useEffect, useRef, useState } from "react";

import { css, FlattenSimpleInterpolation } from "styled-components";

import { SelectWrap } from "./SelectWrap";

import iconDown from "@/assets/icons/down.svg";
import Input from "@/components/BaseComponents/Input";
import { useClickOutside } from "@/hooks/useClickOutSide";
import { uuid } from "@/utils";

export interface OptionProps {
  name: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  defaultOption?: OptionProps | string | number | boolean;
  controlOption?: OptionProps | string | number | boolean;
  options: OptionProps[];
  onChange: (data: OptionProps) => void;
  width?: string | number;
  cssStyles: FlattenSimpleInterpolation;
}

const Select: React.FC<SelectProps> = ({
  defaultOption,
  controlOption,
  options,
  onChange,
  label,
  width = "100%",
  cssStyles,
}) => {
  const defaultSelectIdx =
    typeof defaultOption === "object"
      ? options.findIndex(option => option.value === defaultOption.value)
      : typeof defaultOption === "string"
      ? options.findIndex(option => option.value === defaultOption)
      : typeof defaultOption === "number"
      ? defaultOption
      : defaultOption
      ? 0
      : -1;
  const controlSelectIdx =
    typeof controlOption === "object"
      ? options.findIndex(option => option.value === controlOption.value)
      : typeof controlOption === "string"
      ? options.findIndex(option => option.value === controlOption)
      : typeof controlOption === "number"
      ? controlOption
      : controlOption
      ? 0
      : -1;

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectIdx, setSelectIdx] = useState(
    defaultSelectIdx || controlSelectIdx,
  );

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setSelectorVisible(false);
  });

  useEffect(() => {
    if (controlSelectIdx !== -1) {
      setSelectIdx(controlSelectIdx);
    }
  }, [controlSelectIdx]);

  return (
    <SelectWrap
      haveLabel={label !== undefined}
      width={width}
      selectorVisible={selectorVisible}
      cssStyles={cssStyles}
    >
      <div
        className='selectContainer'
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectorVisible(!selectorVisible);
        }}
        ref={ref}
      >
        <img src={iconDown} className='icon' />
        {label && <div className='inputLabel'>{label}</div>}

        <Input
          value={selectIdx >= 0 ? options[selectIdx].name : ""}
          readOnly
          cssStyles={css`
            cursor: pointer;
          `}
        />
        {selectorVisible && (
          <div className='selector'>
            {options.map((option, idx) => (
              <div
                className='optionContainer'
                key={`option${uuid()}`}
                onClick={() => {
                  setSelectIdx(idx);
                  onChange(options[idx]);
                  setSelectorVisible(false);
                }}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </SelectWrap>
  );
};
export default Select;
