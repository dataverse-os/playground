import styled from 'styled-components';

export const RadioGroupWrap = styled.div`
  .radioGroupContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .radioContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 13.5px;
    height: 13.5px;
    background: #212426;
    border-radius: 50%;
  }

  .radio {
    width: 7.5px;
    height: 7.5px;
    background: #8c8e8f;
    border-radius: 50%;
  }

  .labelSpan {
    margin-left: 12px;
  }
`;
