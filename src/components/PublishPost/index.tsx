import imgIcon from "@/assets/icons/img.svg";
import lockIcon from "@/assets/icons/lock.svg";
import crossIcon from "@/assets/icons/cross.svg";
import Button from "@/components/BaseComponents/Button";
import Textarea from "@/components/BaseComponents/Textarea";
import { useAppDispatch, useSelector } from "@/state/hook";
import {
  // displayPostList,
  postSlice,
  // publishPost,
  uploadImg,
} from "@/state/post/slice";
import { privacySettingsSlice } from "@/state/privacySettings/slice";
import { addressAbbreviation, getAddressFromDid } from "@/utils/didAndAddress";
import { uuid } from "@/utils/uuid";
import { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { css } from "styled-components";
import AccountStatus from "../AccountStatus";
import { FlexRow } from "../App/styled";
import PrivacySettings from "../PrivacySettings";
import {
  ButtonWrapper,
  Content,
  UploadImg,
  UploadImgCross,
  UploadImgWrapper,
  Wrapper,
} from "./styled";
// import { connectIdentity } from "@/state/identity/slice";
import { Message } from "@arco-design/web-react";
import { IconArrowRight } from "@arco-design/web-react/icon";
import CreateLensProfile from "../CreateLensProfile";
import { getLensProfiles } from "@/sdk/monetize";
import { lensProfileSlice } from "@/state/lensProfile/slice";
import { useStream } from "@/hooks";
import { appName, appVersion } from "@/sdk";
import { Model, PostStream, PostType } from "@/types";
import app from "@/output/app.json"

export interface PublishPostProps {}

const PublishPost: React.FC<PublishPostProps> = ({}) => {
  const dispatch = useAppDispatch();
  const pkh = useSelector((state) => state.identity.pkh);
  const needEncrypt = useSelector((state) => state.privacySettings.needEncrypt);
  const settings = useSelector((state) => state.privacySettings.settings);
  const encryptedContent = useSelector((state) => state.post.encryptedContent);
  const isEncrypting = useSelector((state) => state.post.isEncrypting);
  const isEncryptedSuccessfully = useSelector(
    (state) => state.post.isEncryptedSuccessfully
  );
  const isPublishingPost = useSelector((state) => state.post.isPublishingPost);
  const profileId = useSelector((state) => state.lensProfile.profileId);

  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageListType>([]);
  const [postImages, setPostImages] = useState<string[]>([]);

  const [postModel, setPostModel] = useState<Model>({
    modelName: "",
    modelId: "",
    isPublicDomain: false,
  });

  const {
    createPublicStream,
    createPayableStream,
    loadStream,
  } = useStream(appName);

  const maxNumber = 69;

  useEffect(() => {
    setPostModel(
      // app.models.find(
      //   (model) => model.name === `${app.createDapp.slug}_post`
      // ) as Model
      Object.values(app.models).find((model) => model.modelName === 'playground_post') as Model
    );
  }, []);

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

  // const encrypt = async () => {
  //   if (isEncrypting || isEncryptedSuccessfully) return;
  //   if (!did) {
  //     Message.info("Please connect identity first.");
  //     return;
  //   }
  //   dispatch(
  //     encryptPost({
  //       did,
  //       postContent: {
  //         text: content,
  //         images: images.map((image) => image["upload"]),
  //         videos: [],
  //       },
  //     })
  //   );
  // };

  const handleProfileAndPost = async () => {
    if (isPublishingPost) return;
    // const { payload: did } = await dispatch(connectIdentity());

    const postImages = await handlePostImages();
    if (!postImages) return;

    dispatch(postSlice.actions.setIsPublishingPost(true));

    let lensProfiles: any[] = [];
    if (needEncrypt) {
      lensProfiles = await getLensProfiles(getAddressFromDid(pkh as string));

      if (lensProfiles.length === 0) {
        dispatch(postSlice.actions.setIsPublishingPost(false));
        dispatch(lensProfileSlice.actions.setModalVisible(true));
        return;
      }
      await post({
        postImages,
        profileId: lensProfiles.slice(-1)[0].id,
      });
    } else {
      await post({
        postImages,
      });
    }
  };

  const handlePostImages = async () => {
    if (needEncrypt) {
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
    const postImages = (await (
      await dispatch(uploadImg({ files }))
    ).payload) as string[];

    if (!content && postImages.length === 0) {
      Message.info("Text and pictures cannot both be empty.");
      return;
    }

    setPostImages(postImages);
    return postImages;
  };

  const post = async ({
    profileId,
    postImages,
  }: {
    profileId?: string;
    postImages: string[];
  }) => {
    // const res = await dispatch(
    //   publishPost({
    //     profileId,
    //     text: content,
    //     images: postImages,
    //     videos: [],
    //     encrypted: {
    //       text: true,
    //       images: true,
    //       videos: false,
    //     }
    //   })
    // );
    // settings
    try {
      let res;
      const date = new Date().toISOString();
      console.log("Before create stream, settings:", settings)
      switch(settings.postType) {
        case PostType.Public:
          res = await createPublicStream({
            pkh,
            model: postModel,
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
          console.log("[Branch PostType.Public]: After createPublicStream, res:", res)
          break;
        case PostType.Private:
          break;
        case PostType.Datatoken:
          res = await createPayableStream({
            pkh,
            model: postModel,
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
            }
          });
          console.log("[Branch PostType.Datatoken]: After createPayableStream, res:", res)
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
      // dispatch(displayPostList());
      initStreamList();
    } catch (error: any) {
      Message.error((error?.message ?? error));
    } finally {
      dispatch(postSlice.actions.setIsPublishingPost(false));
    }
    
    // if (res.meta.requestStatus === "fulfilled") {
    //   Message.success({
    //     content: (
    //       <>
    //         Post successfully!
    //         <a
    //           href={`${process.env.DATAVERSE_OS}/finder`}
    //           target="_blank"
    //           style={{ marginLeft: "5px", color: "black" }}
    //         >
    //           <span style={{ textDecoration: "underline" }}>
    //             View on DataverseOS File System
    //           </span>
    //           <IconArrowRight
    //             style={{
    //               color: "black",
    //               transform: "rotate(-45deg)",
    //             }}
    //           />
    //         </a>
    //       </>
    //     ),
    //   });
    //   setContent("");
    //   setImages([]);
    //   dispatch(displayPostList());
    // }
    // dispatch(postSlice.actions.setIsPublishingPost(false));
  };

  useEffect(() => {
    postAfterProfileCreated();
  }, [profileId, postImages]);

  useEffect(() => {
    dispatch(postSlice.actions.setIsPublishingPost(false));
  }, []);

  const postAfterProfileCreated = async () => {
    if (!profileId || !postImages) return;
    dispatch(postSlice.actions.setIsPublishingPost(true));
    post({ profileId, postImages });
    dispatch(lensProfileSlice.actions.setProfileId(""));
  };

  const openPrivacySettings = () => {
    dispatch(privacySettingsSlice.actions.setModalVisible(true));
  };

  const initStreamList = async () => {
    console.log("load with hooks, modelId:", postModel.modelId)
    const streams = await loadStream({pkh, modelId: postModel.modelId});
    console.log("load with hooks, streams:", streams)
    const streamList: PostStream[] = [];

    Object.entries(streams).forEach(([streamId, streamContent]) => {
      streamList.push({
        streamId,
        streamContent,
      });
    });
    console.log("pushed, streamList:", streamList)
    const sortedList = streamList
      .filter(
        (el) =>
          el.streamContent.content?.appVersion === appVersion &&
          (el.streamContent.content.text ||
            (el.streamContent.content.images &&
              el.streamContent.content.images?.length > 0) ||
            (el.streamContent.content.videos &&
              el.streamContent.content.videos?.length > 0))
      )
      .sort(
        (a, b) =>
          Date.parse(b.streamContent.createdAt) -
          Date.parse(a.streamContent.createdAt)
      );
    dispatch(postSlice.actions.setPostStreamList(sortedList));
  }

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
                name={addressAbbreviation(getAddressFromDid(pkh)) ?? ""}
                cssStyles={css`
                  margin-bottom: 1rem;
                `}
                did={pkh}
              />
              <Textarea
                value={encryptedContent || content}
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
                    loading={isPublishingPost}
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
      <PrivacySettings></PrivacySettings>
      <CreateLensProfile></CreateLensProfile>
    </Wrapper>
  );
};

export default PublishPost;
