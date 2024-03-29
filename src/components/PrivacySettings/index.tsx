import React, { useEffect, useState } from "react";

import { Currency } from "@dataverse/dataverse-connector";
import { css } from "styled-components";

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
import Input from "../BaseComponents/Input";
import Modal from "../BaseComponents/Modal";
import Select, { OptionProps } from "../BaseComponents/Select";
import Switch from "../BaseComponents/Switch/Switch";

import iconTick from "@/assets/icons/tick_black_thin.svg";
import { PrivacySettingsType } from "@/types";

const amountReg = new RegExp("^([0-9][0-9]*)+(.[0-9]{1,17})?$");

interface PrivacySettingsProps {
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  settings: PrivacySettingsType;
  setSettings: React.Dispatch<React.SetStateAction<PrivacySettingsType>>;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  isModalVisible,
  setModalVisible,
  settings,
  setSettings,
}) => {
  const [currency, setCurrency] = useState<OptionProps>({
    name: "WMATIC",
    value: "WMATIC",
  });
  const [amount, setAmount] = useState("");
  const [limit, setLimit] = useState("");
  const [checked, setChecked] = useState(false);
  const [inputWarn, setInputWarn] = useState(false);
  const [needEncrypt, setNeedEncrypt] = useState(false);
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
    setModalVisible(false);
  };

  const saveSettings = () => {
    if (needEncrypt) {
      if (isInputValid()) {
        setInputWarn(false);
        setSettings({
          needEncrypt: true,
          currency: currency.value as Currency,
          amount: parseFloat(amount),
          collectLimit: checked ? (2n ** 52n).toString() : limit,
        });
        setModalVisible(false);
      } else {
        setInputWarn(true);
      }
    } else {
      setSettings({
        needEncrypt: false,
      });
      setModalVisible(false);
    }
  };

  const switchEncrypt = (value: boolean) => {
    setNeedEncrypt(value);
  };

  useEffect(() => {
    if (isModalVisible) {
      setNeedEncrypt(settings.needEncrypt);
      setAmount(settings.amount?.toString() || "");
      if (settings.collectLimit === (2n ** 52n).toString()) {
        setLimit("");
        setChecked(true);
      } else {
        setLimit(settings.collectLimit?.toString() || "");
        setChecked(false);
      }
      setCurrency({
        name: settings.currency || "WMATIC",
        value: settings.currency || "WMATIC",
      });
    }
  }, [isModalVisible]);

  return (
    <Wrapper>
      <Modal
        id='privacySettings'
        title='Privacy Settings'
        // width={280}
        controlVisible={isModalVisible}
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
          <Switch controlChecked={needEncrypt} onChange={switchEncrypt} />
        </EncryptWrapper>
        {needEncrypt && (
          <>
            {" "}
            <Title>Price</Title>
            <ItemWrapper>
              <Input
                value={amount}
                type='number'
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
                controlOption={currency}
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
                onChange={data => {
                  console.log(data);
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
                type='number'
                cssStyles={css`
                  width: auto !important;
                `}
                canBeEmpty={checked || !inputWarn ? true : false}
                positive={inputWarn && !checked}
                placeholder={`eg 20`}
                onChange={value => {
                  setLimit(value);
                  value && setChecked(false);
                }}
                decimalPlaces={0}
              />
              <UnlimitedWrapper
                onClick={() => {
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
              <div className='tip'>
                Data Monetization is on Mumbai. Testnet Matic faucet
                <a
                  href={process.env.MUMBAI_FAUCET}
                  target='_blank'
                  className='link'
                  rel='noreferrer'
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
