import Modal from "@/components/BaseComponents/Modal";
import Button from "@/components/BaseComponents/Button";
import logoSvg from "@/assets/icons/logo.svg";
import { buttonStyle, modelWrapper } from "./styled";
import { useAppDispatch, useSelector } from "@/state/hook";
import { noExtensionSlice } from "@/state/noExtension/slice";
import { useEffect } from "react";

const NoExtensionTip = function () {
  const dispatch = useAppDispatch();
  const { modalVisible } = useSelector((state) => state.noExtension);
  
  const closeModel = () => {
    dispatch(noExtensionSlice.actions.setModalVisible(false));
  };

  return (
    <Modal
      controlVisible={modalVisible}
      width={542}
      cssStyle={modelWrapper}
      onCancel={closeModel}
      mask
    >
      <div className="header">
        <img src={logoSvg} className="icon" />
        <div className="title">Data Wallet</div>
      </div>
      <div className="body">
        <div className="title">Your home for Data Assets</div>
        <div className="desc">
          Aggregate all your data contents in one <br />
          place, with built-in file system.
        </div>
        <div className="title" style={{ marginTop: "50px" }}>
          Secure identity manager
        </div>
        <div className="desc">
          Support sign-in-with-ethereum and protect
          <br />
          your resources from malicious apps.
        </div>
      </div>
      <Button
        css={buttonStyle}
        type="primary"
        onClick={async () => window.open(process.env.DATAVERSE_GOOGLE_STORE)}
      >
        Download
      </Button>
    </Modal>
  );
};

export default NoExtensionTip;
