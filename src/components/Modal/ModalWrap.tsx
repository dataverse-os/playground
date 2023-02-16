import styled from "styled-components";

export const ModalWrap = styled.div<{
  width: number;
  visible: boolean;
  mask: boolean;
}>`
  .modalContainer {
    width: ${(props) => `${props.width}px`};
    background-color: #fff;
    background-clip: padding-box;
    border: 0;
    border-radius: 8px;
    box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
    pointer-events: auto;
    padding: 20px 24px;
  }

  .maskContainer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: ${(props) => (props.visible ? "visible" : "hidden")};
    background: ${(props) =>
      props.mask ? "rgba(1, 1, 1, 0.6)" : "rgba(0, 0, 0, 0)"};
    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity 0.15s;
  }

  .childrenContainer {
    max-width: 100%;
    max-height: 100%;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    /* transition: all 0.3s; */
    transform: ${(props) => (props.visible ? "scale(1)" : "scale(0.3)")};
  }

  .headerContainer {
    align-items: center;
    justify-content: space-between;
    display: flex;
    font-size: 20px;
    
    .placeholder {
      width: 40px;
    }
  }

  .footerContainer {
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 5px;
    margin-top: 10px;
  }
`;
