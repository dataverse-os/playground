import React, { useRef, useState } from "react";
import { SelectWrap } from "./SelectWrap";
import Input from "@/components/BaseComponents/Input";
import { uuid } from "@/utils";
import { useClickOutside } from "@/hooks/useClickOutSide";
import iconDown from "@/assets/icons/down.svg";
import { css, FlattenSimpleInterpolation } from "styled-components";

interface OptionProps {
  name: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  defaultOptionIdx?: number;
  options: OptionProps[];
  onChange: (data: OptionProps) => void;
  width?: string | number;
  cssStyles: FlattenSimpleInterpolation;
}

const Select: React.FC<SelectProps> = ({
  defaultOptionIdx,
  options,
  onChange,
  label,
  width = "100%",
  cssStyles,
}) => {
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [selectIdx, setSelectIdx] = useState(defaultOptionIdx || 0);
  const ref = useRef(null);
  useClickOutside(ref, () => {
    setSelectorVisible(false);
  });
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
          value={options[selectIdx].name}
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
