import React, { useState } from "react";

import Input from "@/components/BaseComponents/Input";
import Modal from "@/components/BaseComponents/Modal";
import createSvg from "@/assets/icons/create.svg";
import Button from "@/components/BaseComponents/Button";
import { Message } from "@arco-design/web-react";
import { buttonStyle, inputStyle, modelWrapper } from "./styled";
import { useCreateProfile } from "@dataverse/hooks";

interface CreateLensProfileProps {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateLensProfile: React.FC<CreateLensProfileProps> = ({
  isModalVisible,
  setModalVisible,
}) => {
  const [handle, setHandle] = useState("");

  const { isPending, createProfile } = useCreateProfile({
    onPending: handle => {
      if (!/^[\da-z]{5,26}$/.test(handle!) || handle!.length > 26) {
        Message.info(
          "Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length",
        );
        return;
      }
    },
    onError: error => {
      ((error as any).message ?? error) &&
        Message.error(((error as any).message ?? error).slice(0, 100));
    },
    onSuccess: () => {
      Message.success("Create Lens profile successfully!");
      closeModel();
    },
  });

  const submit = async () => {
    await createProfile(handle);
  };

  const closeModel = () => {
    setModalVisible(false);
    setHandle("");
  };

  return (
    <Modal
      controlVisible={isModalVisible}
      width={512}
      cssStyle={modelWrapper}
      onCancel={closeModel}
    >
      <div className='header'>
        <img src={createSvg} className='icon' />
        <div className='title'>{"Create Lens profile"}</div>
      </div>
      <div className='body'>
        <div className='title'>Handle</div>
        <Input
          value={handle}
          cssStyles={inputStyle}
          placeholder={"username"}
          onChange={(v: string) => setHandle(v)}
        />
        <div className='tip'>
          {/* {t('tip: only lowercase letters, numbers and underscores, within 31 bytes')} */}
          Tip: Only supports lower case characters, numbers, must be minimum of
          5 length and maximum of 26 length
        </div>
        <Button
          width={110}
          loading={isPending}
          css={buttonStyle}
          type='primary'
          onClick={submit}
        >
          {"Submit"}
        </Button>
      </div>
    </Modal>
  );
};
