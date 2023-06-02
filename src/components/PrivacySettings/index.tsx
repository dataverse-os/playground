import { useAppDispatch, useSelector } from "@/state/hook";
import { MouseEvent, useEffect, useState } from "react";
import { privacySettingsSlice } from "@/state/privacySettings/slice";
import { css } from "styled-components";
import Modal from "../BaseComponents/Modal";
import Switch from "../BaseComponents/Switch/Switch";
import Input from "../BaseComponents/Input";
import iconTick from "@/assets/icons/tick_black_thin.svg";
import {
  EncryptWrapper,
  ItemWrapper,
  Title,
  UnlimitedCheckBox,
  UnlimitedCheckBoxImg,
  UnlimitedText,
  UnlimitedWrapper,
  Wrapper,
} from "./styled";
import Select from "../BaseComponents/Select";
import { PostType } from "@/types";

const amountReg = new RegExp("^([0-9][0-9]*)+(.[0-9]{1,17})?$");

const PrivacySettings: React.FC = () => {
  const modalVisible = useSelector(
    (state) => state.privacySettings.modalVisible
  );
  const settings = useSelector((state) => state.privacySettings.settings);

  const dispatch = useAppDispatch();
  const [needEncrypt, setNeedEncrypt] = useState(false);
  const [currency, setCurrency] = useState<any>({
    name: "WMATIC",
    value: "WMATIC",
  });
  const [amount, setAmount] = useState("");
  const [limit, setLimit] = useState("");
  const [checked, setChecked] = useState(false);
  const [clear, setClear] = useState(false);
  const [inputWarn, setInputWarn] = useState(false);
  const isInputValid = () => {
    const isValid =
      amount !== "" &&
      ((limit !== "" && !checked) || checked) &&
      amountReg.test(amount) &&
      parseFloat(amount) > 0 &&
      (checked || parseFloat(limit) > 0);
    return isValid;
  };

  const closeModel = () => {
    dispatch(privacySettingsSlice.actions.setModalVisible(false));
  };

  const saveSettings = () => {
    if (needEncrypt) {
      if (isInputValid()) {
        setInputWarn(false);
        dispatch(
          privacySettingsSlice.actions.setSettings({
            postType: PostType.Datatoken,
            currency: currency.value,
            amount: parseFloat(amount),
            collectLimit: checked ? 2 ** 52 : parseFloat(limit),
          })
        );
        dispatch(privacySettingsSlice.actions.setModalVisible(false));
      } else {
        setInputWarn(true);
      }
    } else {
      dispatch(
        privacySettingsSlice.actions.setSettings({
          postType: PostType.Public,
        })
      );
      dispatch(privacySettingsSlice.actions.setModalVisible(false));
    }
  };

  const switchEncrypt = (value: boolean) => {
    setNeedEncrypt(value);
    dispatch(privacySettingsSlice.actions.setNeedEncrypt(value));
  };

  return (
    <Wrapper>
      <Modal
        id="privacySettings"
        title="Privacy Settings"
        mask
        // width={280}
        controlVisible={modalVisible}
        showCloseButton
        onOk={saveSettings}
        onCancel={closeModel}
        cssStyle={css`
          padding: 30px 60px 40px;
          .headerContainer {
            font-size: 24px;
            font-weight: bold;
            padding: 0;
          }
          .footerContainer {
            margin-top: 40px;
          }
        `}
      >
        <EncryptWrapper>
          <Title
            cssStyles={css`
              margin-top: 0 !important;
            `}
          >
            Encrypt
          </Title>
          <Switch defaultChecked={needEncrypt} onChange={switchEncrypt} />
        </EncryptWrapper>
        {needEncrypt && (
          <>
            {" "}
            <Title>Price</Title>
            <ItemWrapper>
              <Input
                value={amount}
                type="number"
                cssStyles={css`
                  width: auto !important;
                `}
                canBeEmpty={!inputWarn}
                onChange={(val: string) => {
                  setAmount(val);
                }}
                positive={inputWarn}
                reg={inputWarn ? amountReg : undefined}
                placeholder={`eg 20`}
                decimalPlaces={17}
              />
              <Select
                defaultOptionIdx={0}
                options={[
                  {
                    name: "WMATIC",
                    value: "WMATIC",
                  },
                  {
                    name: "WETH",
                    value: "WETH",
                  },
                  {
                    name: "USDC",
                    value: "USDC",
                  },
                  {
                    name: "DAI",
                    value: "DAI",
                  },
                ]}
                onChange={(data) => {
                  setCurrency(data);
                }}
                cssStyles={css`
                  margin-left: 6px;
                `}
                width={135}
              />
            </ItemWrapper>
            <Title>Maximum Supply</Title>
            <ItemWrapper>
              <Input
                value={limit}
                type="number"
                cssStyles={css`
                  width: auto !important;
                `}
                canBeEmpty={checked || !inputWarn ? true : false}
                positive={inputWarn && !checked}
                placeholder={`eg 20`}
                onChange={(value) => {
                  setLimit(value);
                  value && setChecked(false);
                }}
                decimalPlaces={0}
              />
              <UnlimitedWrapper
                onClick={(e) => {
                  if (!checked) {
                    setLimit("");
                  }
                  setChecked(!checked);
                }}
              >
                <UnlimitedCheckBox>
                  {checked && <UnlimitedCheckBoxImg src={iconTick} />}
                </UnlimitedCheckBox>
                <UnlimitedText>Unlimited</UnlimitedText>
              </UnlimitedWrapper>
            </ItemWrapper>
            <ItemWrapper>
              <div className="tip">
                Data Monetization is on Mumbai. Testnet Matic faucet
                <a
                  href={process.env.MUMBAI_FAUCET}
                  target="_blank"
                  className="link"
                >
                  here
                </a>
                .
              </div>
            </ItemWrapper>
          </>
        )}
      </Modal>
    </Wrapper>
  );
};

export default PrivacySettings;
