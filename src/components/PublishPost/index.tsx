import imgIcon from "@/assets/icons/img.svg";
import lockIcon from "@/assets/icons/lock.svg";
import crossIcon from "@/assets/icons/cross.svg";
import Button from "@/components/BaseComponents/Button";
import Textarea from "@/components/BaseComponents/Textarea";
import { addressAbbreviation, uuid } from "@/utils";
import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { css } from "styled-components";
import AccountStatus from "../AccountStatus";
import { FlexRow } from "@/styled";
import PrivacySettings from "../PrivacySettings";
import {
  ButtonWrapper,
  Content,
  UploadImg,
  UploadImgCross,
  UploadImgWrapper,
  Wrapper,
} from "./styled";
import { Message } from "@arco-design/web-react";
import { IconArrowRight } from "@arco-design/web-react/icon";
import { CreateLensProfile } from "../CreateLensProfile";
import { PostType, PrivacySettingsType } from "@/types";
import { usePlaygroundStore } from "@/context";
import { useApp, useProfiles, useStore } from "@dataverse/hooks";
import NoExtensionTip from "../NoExtensionTip";
import { uploadImages } from "@/sdk";

interface PublishPostProps {
  modelId: string;
  isPending: boolean;
  createPublicStream: Function;
  createPayableStream: Function;
}

const PublishPost: React.FC<PublishPostProps> = ({
  modelId,
  isPending,
  createPublicStream,
  createPayableStream,
}) => {
  const {
    modelParser,
    appVersion,
    isDataverseExtension,
    isNoExtensionModalVisible,
    setNoExtensionModalVisible,
    setIsConnecting,
  } = usePlaygroundStore();

  const [needEncrypt, setNeedEncrypt] = useState<boolean>(false);
  const [settings, setSettings] = useState<PrivacySettingsType>({
    postType: PostType.Public,
  });

  const [isSettingModalVisible, setSettingModalVisible] =
    useState<boolean>(false);
  const [isCreateProfileModalVisible, setCreateProfileModalVisible] =
    useState<boolean>(false);

  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const { pkh, address, profileIds } = useStore();
  const { isPending: isConnectingApp, connectApp } = useApp({
    onPending: () => {
      setIsConnecting(true);
    },
    onError: () => {
      setIsConnecting(false);
    },
    onSuccess: () => {
      setIsConnecting(false);
    },
  });
  const { getProfiles } = useProfiles();

  const onChange = (imageList: ImageListType, addUpdateIndex?: number[]) => {
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
    if (isDataverseExtension === false) {
      setNoExtensionModalVisible(true);
      return;
    }
    if (isPending || isConnectingApp) return;

    let accountAddress: string;

    if (!address || !pkh) {
      try {
        const res = await connectApp({ appId: modelParser.appId });
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

    if (needEncrypt) {
      let targetProfileIds: string[];
      console.log("state profileIds:", profileIds)
      if (!profileIds) {
        const lensProfiles = await getProfiles(accountAddress);
        console.log("lensProfiles:", lensProfiles)
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
  };

  const _postImages = async () => {
    if (needEncrypt && settings) {
      const amountReg = new RegExp("^([0-9][0-9]*)+(.[0-9]{1,17})?$");
      const { amount, collectLimit } = settings;
      const isValid =
        amount &&
        collectLimit &&
        amountReg.test(String(amount)) &&
        amount > 0 &&
        collectLimit > 0;
      if (!isValid) {
        Message.info("Incorrect privacy settings!");
        return;
      }
    }
    const files: File[] = [];
    images.map((image) => {
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
      let res;
      const date = new Date().toISOString();
      switch (settings.postType) {
        case PostType.Public:
          res = await createPublicStream({
            modelId,
            stream: {
              appVersion,
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
            res
          );
          break;
        case PostType.Encrypted:
          break;
        case PostType.Payable:
          res = await createPayableStream({
            modelId,
            profileId,
            stream: {
              appVersion,
              text: content,
              images: postImages,
              videos: [],
              createdAt: date,
              updatedAt: date,
            },
            currency: settings.currency!,
            amount: settings.amount!,
            collectLimit: settings.collectLimit!,
            encrypted: {
              text: true,
              images: true,
              videos: false,
            },
          });
          console.log(
            "[Branch PostType.Payable]: After createPayableStream, res:",
            res
          );
          break;
      }
      Message.success({
        content: (
          <>
            Post successfully!
            <a
              href={`${process.env.DATAVERSE_OS}/finder`}
              target="_blank"
              style={{ marginLeft: "5px", color: "black" }}
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
          dataURLKey="upload"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
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
                  <Button type="icon" width={"1.75rem"} onClick={onImageUpload}>
                    <img src={imgIcon} />
                  </Button>
                  <Button
                    type="icon"
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
                    type="primary"
                    loading={isPending || isConnectingApp}
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
        needEncrypt={needEncrypt}
        setNeedEncrypt={setNeedEncrypt}
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
