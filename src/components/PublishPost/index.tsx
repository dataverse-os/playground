import React, { useState } from "react";

import { Message } from "@arco-design/web-react";
import { IconArrowRight } from "@arco-design/web-react/icon";
import {
  Chain,
  ChainId,
  DatatokenType,
  DatatokenVars,
  ReturnType,
  SYSTEM_CALL,
  WALLET,
} from "@dataverse/dataverse-connector";
import {
  useCreateIndexFile,
  useMonetizeFile,
  useProfiles,
  useStore,
} from "@dataverse/hooks";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { css } from "styled-components";

import {
  ButtonWrapper,
  Content,
  UploadImg,
  UploadImgCross,
  UploadImgWrapper,
  Wrapper,
} from "./styled";
import AccountStatus from "../AccountStatus";
import { CreateLensProfile } from "../CreateLensProfile";
import NoExtensionTip from "../NoExtensionTip";
import PrivacySettings from "../PrivacySettings";

import crossIcon from "@/assets/icons/cross.svg";
import imgIcon from "@/assets/icons/img.svg";
import lockIcon from "@/assets/icons/lock.svg";
import Button from "@/components/BaseComponents/Button";
import Textarea from "@/components/BaseComponents/Textarea";
import { usePlaygroundStore } from "@/context";
import { DefaultDatatokenType, uploadImages } from "@/sdk";
import { FlexRow } from "@/styled";
import { PrivacySettingsType } from "@/types";
import { addressAbbreviation, uuid } from "@/utils";

interface PublishPostProps {
  modelId: string;
  connectApp: (args?: {
    wallet?: WALLET | undefined;
    provider?: any;
  }) => Promise<{
    pkh: string;
    address: string;
    chain: Chain;
    wallet: WALLET;
  }>;
}

const PublishPost: React.FC<PublishPostProps> = ({ modelId, connectApp }) => {
  const {
    modelVersion,
    isDataverseExtension,
    isNoExtensionModalVisible,
    setNoExtensionModalVisible,
  } = usePlaygroundStore();

  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const { createIndexFile } = useCreateIndexFile();
  const { monetizeFile } = useMonetizeFile();

  const [settings, setSettings] = useState<PrivacySettingsType>({
    needEncrypt: false,
  });

  const [isSettingModalVisible, setSettingModalVisible] =
    useState<boolean>(false);
  const [isCreateProfileModalVisible, setCreateProfileModalVisible] =
    useState<boolean>(false);

  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const { pkh, address /* , profileIds */ } = useStore();
  const profileIds = ["Lens profiles are not accessible for now"];
  const { getProfiles } = useProfiles();

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  const onError = (error: any) => {
    if (error?.maxNumber) {
      Message.info("Up to four pictures can be uploaded");
    }
  };

  const textareaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleProfileAndPost = async () => {
    setIsPublishing(true);
    try {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }
      if (isPublishing) return;

      let accountAddress: string;

      if (!address || !pkh) {
        try {
          const res = await connectApp();
          accountAddress = res.address;
        } catch (error) {
          console.error(error);
          return;
        }
      } else {
        accountAddress = address;
      }

      const postImages = await _postImages();
      if (!postImages) return;

      if (settings.needEncrypt) {
        let targetProfileIds: string[];
        if (!profileIds) {
          const lensProfiles = await getProfiles({
            chainId: ChainId.PolygonMumbai,
            accountAddress,
          });
          targetProfileIds = lensProfiles;
        } else {
          targetProfileIds = profileIds;
        }
        if (targetProfileIds.length === 0) {
          setCreateProfileModalVisible(true);
        } else {
          await _post({
            postImages,
            profileId: targetProfileIds[0],
          });
        }
      } else {
        await _post({
          postImages,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const _postImages = async () => {
    if (settings && settings.needEncrypt) {
      const amountReg = new RegExp("^([0-9][0-9]*)+(.[0-9]{1,17})?$");
      const { amount, collectLimit } = settings;
      const isValid =
        amount &&
        collectLimit &&
        amountReg.test(String(amount)) &&
        amount > 0 &&
        parseFloat(collectLimit) > 0;
      if (!isValid) {
        Message.info("Incorrect privacy settings!");
        return;
      }
    }
    const files: File[] = [];
    images.map(image => {
      if (image.file) {
        files.push(image.file);
      }
    });

    const postImages = await uploadImages(files);

    if (!content && postImages.length === 0) {
      Message.info("Text and pictures cannot both be empty.");
      return;
    }

    return postImages;
  };

  const _post = async ({
    profileId,
    postImages,
  }: {
    profileId?: string;
    postImages: string[];
  }) => {
    if (!settings) {
      throw new Error("settings undefined");
    }
    try {
      let res: Awaited<ReturnType[SYSTEM_CALL.createIndexFile]>;
      const date = new Date().toISOString();
      if (settings.needEncrypt) {
        res = await createIndexFile({
          modelId,
          fileContent: {
            modelVersion,
            text: content,
            images: postImages,
            videos: [],
            createdAt: date,
            updatedAt: date,
            encrypted: {
              text: true,
              images: true,
              videos: false,
            },
          },
        });
        if (DefaultDatatokenType === DatatokenType.Cyber) {
          throw new Error("Cyber type is not supported yet");
        }
        const datatokenVars: DatatokenVars =
          DefaultDatatokenType === DatatokenType.Profileless
            ? {
                type: DefaultDatatokenType,
                chainId: ChainId.PolygonMumbai,
                collectModule: "LimitedFeeCollectModule",
                currency: settings.currency!,
                amount: settings.amount!,
                collectLimit: settings.collectLimit!,
              }
            : {
                type: DefaultDatatokenType,
                profileId: profileId!,
                chainId: ChainId.PolygonMumbai,
                // TODO
                collectModule: "SimpleFeeCollectModule",
                currency: settings.currency!,
                amount: settings.amount!,
                collectLimit: settings.collectLimit!,
                // TODO
                recipient: "",
                endTimestamp: 0,
              };
        await monetizeFile({
          fileId: res.fileContent.file.fileId,
          datatokenVars,
        });
        console.log(
          "[Branch PostType.Payable]: After createPayableStream, res:",
          res,
        );
      } else {
        res = await createIndexFile({
          modelId,
          fileContent: {
            modelVersion,
            profileId,
            text: content,
            images: postImages,
            videos: [],
            createdAt: date,
            updatedAt: date,
          },
        });
        console.log(
          "[Branch PostType.Public]: After createPublicStream, res:",
          res,
        );
      }
      Message.success({
        content: (
          <>
            Post successfully!
            <a
              href={`${process.env.DATAVERSE_OS}/finder`}
              target='_blank'
              style={{ marginLeft: "5px", color: "black" }}
              rel='noreferrer'
            >
              <span style={{ textDecoration: "underline" }}>
                View on DataverseOS File System
              </span>
              <IconArrowRight
                style={{
                  color: "black",
                  transform: "rotate(-45deg)",
                }}
              />
            </a>
          </>
        ),
      });
      setSettings({
        needEncrypt: false,
      });
      setContent("");
      setImages([]);
    } catch (error: any) {
      Message.error(error?.message ?? error);
    }
  };

  const openPrivacySettings = () => {
    setSettingModalVisible(true);
  };

  return (
    <Wrapper>
      <Content>
        <ImageUploading
          multiple
          maxNumber={4}
          value={images}
          onChange={onChange}
          onError={onError}
          dataURLKey='upload'
        >
          {({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => (
            <>
              <AccountStatus
                name={addressAbbreviation(address) ?? ""}
                cssStyles={css`
                  margin-bottom: 1rem;
                `}
                did={pkh || ""}
              />
              <Textarea
                value={content}
                placeholder="what's happening?"
                onChange={textareaOnChange}
                width={"100%"}
                height={147}
              />
              <FlexRow>
                {imageList.map((image, index) => (
                  <UploadImgWrapper key={uuid()}>
                    <UploadImgCross
                      src={crossIcon}
                      onClick={() => {
                        onImageRemove(index);
                      }}
                    />
                    <UploadImg
                      src={image["upload"]}
                      onClick={() => {
                        onImageUpdate(index);
                      }}
                    />
                  </UploadImgWrapper>
                ))}
              </FlexRow>
              <ButtonWrapper>
                <FlexRow>
                  <Button type='icon' width={"1.75rem"} onClick={onImageUpload}>
                    <img src={imgIcon} />
                  </Button>
                  <Button
                    type='icon'
                    width={"1.75rem"}
                    css={css`
                      margin-left: 26px;
                    `}
                    onClick={openPrivacySettings}
                  >
                    <img src={lockIcon} />
                  </Button>
                </FlexRow>
                <FlexRow>
                  <Button
                    type='primary'
                    loading={isPublishing}
                    onClick={handleProfileAndPost}
                    width={110}
                    css={css`
                      border-radius: 8px;
                      padding: 0.3rem 2rem;
                    `}
                  >
                    Post
                  </Button>
                </FlexRow>
              </ButtonWrapper>
            </>
          )}
        </ImageUploading>
      </Content>
      <PrivacySettings
        isModalVisible={isSettingModalVisible}
        setModalVisible={setSettingModalVisible}
        settings={settings}
        setSettings={setSettings}
      />
      <CreateLensProfile
        isModalVisible={isCreateProfileModalVisible}
        setModalVisible={setCreateProfileModalVisible}
      />
      <NoExtensionTip
        isModalVisible={isNoExtensionModalVisible}
        setModalVisible={setNoExtensionModalVisible}
      />
    </Wrapper>
  );
};

export default PublishPost;
