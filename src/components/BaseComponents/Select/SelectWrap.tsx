import styled, { FlattenSimpleInterpolation } from "styled-components";

export const SelectWrap = styled.div<{
  haveLabel: boolean;
  width: string | number;
  selectorVisible: boolean;
  cssStyles?: FlattenSimpleInterpolation;
}>`
  .selectContainer {
    box-sizing: border-box;
    position: relative;
    width: ${(props) =>
      typeof props.width === "number" ? `${props.width}px` : props.width};
    margin-left: ${(props) =>
      typeof props.width === "string"
        ? `${100 - parseInt(props.width, 10)}%`
        : ""};
    cursor: pointer;
  }
  .selectDropdownImg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 12px;
    margin: auto;
    transform: 0;
    transition: all 0.3s;
  }
  .down {
    transform: rotate(180deg);
  }

  .icon {
    position: absolute;
    top: ${(props) => (props.haveLabel ? "24" : "0")}px;
    bottom: 0;
    right: 5px;
    left: unset;
    margin: auto;
    transform: ${(props) => (props.selectorVisible ? "rotate(180deg)" : "0")};
    transition: all 0.3s;
  }

  .optionContainer {
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .optionContainer:hover {
    background-color: #eee;
    font-family: Poppins-SemiBold;
    font-weight: 600;
  }
  .selector {
    box-sizing: border-box;
    position: absolute;
    top: ${(props) => (props.haveLabel ? "62" : "35")}px;
    z-index: 1;
    width: 100%;
    background-color: #f8f7f7;
    border-radius: 8px;
    padding: 5px;
    font-size: 0.75rem;
    line-height: 0.75rem;
    cursor: pointer;
    overflow-y: auto;
    font-family: Poppins;
    box-shadow: rgb(0 0 0 / 25%) 0px 4px 12px;
  }
  .inputBox {
    cursor: pointer;
  }
  ${(props) => props.cssStyles}
`;
