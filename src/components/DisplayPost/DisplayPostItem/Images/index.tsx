import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { Secret, Image, ImgWrapper, ImageWrapperGrid } from "./styled";
import React, { useEffect, useState } from "react";
import { CustomMirrorFile, Post, PostContent, PostStream } from "@/types";
import question from "@/assets/icons/question.png";

export interface TextProps {
  postStream: PostStream;
}

const Images: React.FC<TextProps> = ({ postStream }) => {
  const [images, setImages] = useState<string[]>([]);
  const showImage = (postStream: PostStream) => {
    if (postStream.streamContent.appVersion === oldAppVersion) {
      return [];
    }
    if (postStream.streamContent.fileType === FileType.Public) {
      return (
        (
          (postStream.streamContent.content.content as Post)
            .postContent as PostContent
        )?.images ?? []
      );
    }
    if (postStream.streamContent.fileType === FileType.Private) {
      if (postStream.isDecryptedSuccessfully) {
        return (
          (
            (postStream.streamContent.content.content as Post)
              .postContent as PostContent
          )?.images ?? []
        );
      }
      return (
        Array.from<string>({
          length: (postStream.streamContent.content.content as Post).options
            ?.lockedImagesNum!,
        }).fill("?") ?? []
      );
    }
    if (postStream.streamContent.fileType === FileType.Datatoken) {
      if (
        postStream.isDecryptedSuccessfully ||
        postStream.hasBoughtSuccessfully
      ) {
        return (
          (
            (postStream.streamContent.content.content as Post)
              .postContent as PostContent
          )?.images ?? []
        );
      }
      return (
        Array.from<string>({
          length: (postStream.streamContent.content.content as Post).options
            ?.lockedImagesNum!,
        }).fill("?") ?? []
      );
    }
    return [];
  };
  useEffect(() => {
    if(postStream.isGettingDatatokenInfo) return;
    let nowImages = showImage(postStream);
    if (
      nowImages.length === 0 &&
      postStream.streamContent.fileType !== FileType.Public &&
      (!postStream.isDecryptedSuccessfully && !postStream.hasBoughtSuccessfully)
    ) {
      nowImages = ["?"];
    }
    nowImages = Array.from(new Set(nowImages));
    setImages(nowImages);
  }, [postStream]);

  const CurrentImgWrapper = images.length < 4 ? ImgWrapper : ImageWrapperGrid;
  return (
    <CurrentImgWrapper>
      {images.map((image, index) => {
        if (image === "?") {
          return (
            <Image
              key={"image" + index}
              src={question}
              imgCount={images.length < 4 ? images.length : 1}
            />
          );
        } else {
          return (
            <Image
              key={"image" + index}
              imgCount={images.length < 4 ? images.length : 1}
              src={image}
            ></Image>
          );
        }
      })}
    </CurrentImgWrapper>
  );
};

export default Images;
