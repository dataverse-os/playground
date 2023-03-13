import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { privacySettingsSlice } from "@/state/privacySettings/slice";
import { Content, Wrapper } from "../PublishPost/styled";
import { css } from "styled-components";
import Modal from "../BaseComponents/Modal";
import CheckBox from "../BaseComponents/CheckBox";

export interface PublishPostProps {}

const PrivacySettings: React.FC<PublishPostProps> = ({}) => {
  const modalVisible = useSelector(
    (state) => state.privacySettings.modalVisible
  );
  const settings = useSelector((state) => state.privacySettings.settings);

  const dispatch = useAppDispatch();

  const closeModel = () => {
    dispatch(privacySettingsSlice.actions.setModalVisible(false));
  };

  const saveSettings = () => {
    dispatch(privacySettingsSlice.actions.setSettings({}));
  };

  return (
    <Wrapper>
      <Content>
        <Modal
          id="privacySettings"
          title="Privacy Settings"
          mask
          width={800}
          controlVisible={modalVisible}
          showCloseButton
          onOk={saveSettings}
          onCancel={closeModel}
          cssStyle={css`
            .headerContainer {
              font-size: 24px;
              font-weight: 500;
            }
          `}
        >
          {/* <RadioGroup>
            <RadioButton label="1"></RadioButton>
            <RadioButton label="2"></RadioButton>
          </RadioGroup> */}
        </Modal>
      </Content>
    </Wrapper>
  );
};

export default PrivacySettings;
