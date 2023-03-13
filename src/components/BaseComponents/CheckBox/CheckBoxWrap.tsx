import styled from "styled-components";

export const CheckBoxWrap = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: rgb(238, 238, 238);
  border-radius: 4px;
  margin-left: 16px;
  margin-right: 4px;
`;

export const CheckBoxRadioWrap = styled.div`
  width: 7.5px;
  height: 7.5px;
  background: #8c8e8f;
  border-radius: 50%;
`;

export const CheckBoxLabelSpanWrap = styled.div`
  margin-left: 5px;
`;
export const CheckBoxContainerWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    width: 16px;
  }
`;
