import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../Button";
import { ModalWrap } from "./ModalWrap";
import usePortal from "@/utils/usePortal";
import { uuid } from "@/utils/uuid";
import { useClickOutside } from "@/utils/useClickOutSide";
import { css, FlattenSimpleInterpolation } from "styled-components";

export interface ModalProps {
  title?: string;
  width: number;
  children?: ReactNode;
  onCancel: () => void;
  onOk?: () => void;
  trigger?: JSX.Element;
  id?: string;
  showCloseButton?: boolean;
  canClickOutsideToClose?: boolean;
  controlVisible?: boolean;
  hiddenScroll?: boolean;
  portal?: boolean;
  parentId?: string;
  mask?: boolean;
  cssStyle?: FlattenSimpleInterpolation;
}

const Modal: React.FC<ModalProps> = ({
  title,
  width = 400,
  children,
  onCancel,
  onOk,
  id = uuid(),
  controlVisible = false,
  showCloseButton = false,
  canClickOutsideToClose = true,
  hiddenScroll = true,
  portal = false,
  parentId = "root",
  trigger,
  mask = false,
  cssStyle,
}) => {
  const [visible, setVisible] = useState(controlVisible);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(controlVisible);
  }, [controlVisible]);

  useEffect(() => {
    if (!visible) {
      onCancel?.();
    }
  }, [visible]);
  const triggerDom = useMemo(() => {
    if (!trigger) {
      return null;
    }

    return React.cloneElement(trigger, {
      key: "trigger",
      ...trigger.props,
      onClick: async (e: any) => {
        setVisible(!visible);
        trigger.props?.onClick?.(e);
      },
    });
  }, [setVisible, trigger, visible]);

  const handleClose = () => {
    setVisible(false);
  };

  useClickOutside(modalRef, () => {
    if (canClickOutsideToClose) {
      handleClose();
    }
  });

  useEffect(() => {
    if (visible && hiddenScroll) {
      document.body.style.overflow = "hidden";
      // document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
  }, [visible, id]);

  const target = usePortal(parentId);
  const elements = (
    <ModalWrap visible={visible} mask={mask} width={width} cssStyle={cssStyle}>
      <div id={id} className="maskContainer">
        <div className="modalContainer" ref={modalRef}>
          <div className="headerContainer">
            <div className="placeholder" />
            <div>{title}</div>
            {showCloseButton && (
              <Button
                onClick={() => {
                  handleClose();
                }}
                width={20}
                type={"text"}
                css={css`
                  padding: 0;
                `}
              >
                X
              </Button>
            )}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="childrenContainer"
          >
            {children}
          </div>

          <div className="footerContainer">
            <Button
              onClick={() => {
                onOk?.();
              }}
              type="gray"
            >
              ok
            </Button>
          </div>
        </div>
      </div>
    </ModalWrap>
  );
  return portal ? (
    <>
      {triggerDom}
      {createPortal(elements, target)}
    </>
  ) : (
    <>
      {triggerDom}
      {elements}
    </>
  );
};

export default Modal;
