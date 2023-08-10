import React from "react";
import Modal from "@/components/BaseComponents/Modal";
import Button from "@/components/BaseComponents/Button";
import logoSvg from "@/assets/icons/logo.svg";
import { buttonStyle, modelWrapper } from "./styled";

interface NoExtensionTipProps {
  isModalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const NoExtensionTip: React.FC<NoExtensionTipProps> = ({
  isModalVisible,
  setModalVisible,
}) => {
  const closeModel = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      controlVisible={isModalVisible}
      width={542}
      cssStyle={modelWrapper}
      onCancel={closeModel}
    >
      <div className='header'>
        <img src={logoSvg} className='icon' />
        <div className='title'>Data Wallet</div>
      </div>
      <div className='body'>
        <div className='title'>Your home for Data Assets</div>
        <div className='desc'>
          Aggregate all your data contents in one <br />
          place, with built-in file system.
        </div>
        <div className='title' style={{ marginTop: "50px" }}>
          Secure identity manager
        </div>
        <div className='desc'>
          Support sign-in-with-ethereum and protect
          <br />
          your resources from malicious apps.
        </div>
      </div>
      <Button
        css={buttonStyle}
        type='primary'
        onClick={async () => window.open(process.env.DATAVERSE_GOOGLE_STORE)}
      >
        Download
      </Button>
    </Modal>
  );
};

export default NoExtensionTip;
