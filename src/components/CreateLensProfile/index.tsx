import React, { useContext, useEffect, useState } from "react";

import Input from "@/components/BaseComponents/Input";
import Modal from "@/components/BaseComponents/Modal";
import createSvg from "@/assets/icons/create.svg";
import Button from "@/components/BaseComponents/Button";
import addSvg from "@/assets/icons/add.svg";
import { Message } from "@arco-design/web-react";
import { buttonStyle, inputStyle, modelWrapper } from "./styled";
import { useAppDispatch, useSelector } from "@/state/hook";
import { noExtensionSlice } from "@/state/noExtension/slice";
import { lensProfileSlice } from "@/state/lensProfile/slice";
import { createLensProfile } from "@/sdk";

export const CreateLensProfile = () => {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const modalVisible = useSelector((state) => state.lensProfile.modalVisible);

  const closeModel = () => {
    dispatch(lensProfileSlice.actions.setModalVisible(false));
    // setIsModalVisible(false);
    setHandle("");
  };

  const submit = async () => {
    if (!/^[\da-z]{5,26}$/.test(handle) || handle.length > 26) {
      Message.info(
        "Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length"
      );
      return;
    }
    setLoading(true);
    // const obj = {
    //   handle,
    //   // profilePictureUri:
    //   //   avatar || `https://avatar.tobi.sh/${window.address}_${handle}.png`,
    // };
    try {
      const profileId = await createLensProfile(handle);
      console.log(profileId);
      // dispatch(lensProfileSlice.actions.setProfileId(profileId));
      Message.success("Create Lens profile successfully!");
      closeModel();
    } catch (error: any) {
      (error.message ?? error) &&
        Message.error((error.message ?? error).slice(0, 100));
    }
    setLoading(false);
  };

  return (
    <Modal
      controlVisible={modalVisible}
      width={512}
      cssStyle={modelWrapper}
      onCancel={closeModel}
    >
      <div className="header">
        <img src={createSvg} className="icon" />
        <div className="title">{"Create Lens profile"}</div>
      </div>
      <div className="body">
        <div className="title">Handle</div>
        <Input
          value={handle}
          cssStyles={inputStyle}
          placeholder={"username"}
          onChange={(v: string) => setHandle(v)}
        />
        <div className="tip">
          {/* {t('tip: only lowercase letters, numbers and underscores, within 31 bytes')} */}
          Tip: Only supports lower case characters, numbers, must be minimum of
          5 length and maximum of 26 length
        </div>
        <Button
          width={110}
          loading={loading}
          css={buttonStyle}
          type="primary"
          onClick={submit}
        >
          {"Submit"}
        </Button>
      </div>
    </Modal>
  );
};
