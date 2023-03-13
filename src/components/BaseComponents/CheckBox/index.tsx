import React, { useState } from 'react';
import {
  CheckBoxContainerWrap,
  CheckBoxLabelSpanWrap,
  CheckBoxWrap,
} from './CheckBoxWrap';
import iconTick from '@/assets/icons/tick_black_thin.svg';

export interface CheckBoxProps {
  label: string;
  defaultChecked: boolean;
  onClick: React.MouseEventHandler<HTMLElement>;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  defaultChecked,
  onClick,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <CheckBoxContainerWrap
      onClick={e => {
        onClick(e);
        setChecked(checked => !checked);
      }}
    >
      <CheckBoxWrap>{checked && <img src={iconTick} />}</CheckBoxWrap>
      <CheckBoxLabelSpanWrap>{label}</CheckBoxLabelSpanWrap>
    </CheckBoxContainerWrap>
  );
};

export default CheckBox;
