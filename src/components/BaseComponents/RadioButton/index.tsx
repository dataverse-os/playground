import React, { useState } from "react";
import { RadioButtonWrap } from "./RadioButtonWrap";

export interface SubmitButtonProps {
  label: string;
}

const RadioButton: React.FC<SubmitButtonProps> = ({ label }) => {
  const [checked, setChecked] = useState(false);
  const onClick = () => {
    setChecked(true);
  };

  return (
    <RadioButtonWrap>
      <div className="radioButtonContainer" onClick={onClick}>
        <div className="radioContainer">
          {checked && <div className="radio" />}
        </div>
        <span className="labelSpan">{label}</span>
      </div>
    </RadioButtonWrap>
  );
};

export default RadioButton;
