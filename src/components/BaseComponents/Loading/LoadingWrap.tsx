import styled, { FlattenSimpleInterpolation } from "styled-components";

export const LoadingWrap = styled.div<{
  size: number;
  cssStyles?: FlattenSimpleInterpolation;
}>`
  .circle {
    display: flex;
  }

  .iconSpinner {
    pointer-events: none;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    transition: opacity 0.3s;
  }

  .dot {
    box-sizing: border-box;
    background: #9e9e9e;
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    border-radius: 50px;
    width: ${props => props.size - 24}px;
    height: ${props => props.size - 22}px;
    position: absolute;
  }

  .dots {
    pointer-events: none;
    opacity: 0;
    position: absolute;
    display: flex;
    place-content: center;
    align-items: center;
  }

  .check {
    opacity: 0;
    width: ${props => props.size - 10}px;
  }
  ${props => props.cssStyles}
`;
