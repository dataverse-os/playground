import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { Secret, Image, ImgWrapper, ImageWrapperGrid } from "./styled";
import React, { useEffect, useState } from "react";
import { CustomMirrorFile, PostContent } from "@/types";
import question from '@/assets/icons/question.png'

export interface TextProps {
  mirrorFile: CustomMirrorFile;
}

const Images: React.FC<TextProps> = ({ mirrorFile }) => {
  const [images, setImages] = useState<string[]>([]);
  const showImage = (mirrorFile: CustomMirrorFile) => {
    if (mirrorFile.content.appVersion === oldAppVersion) {
      return [];
    }
    if (mirrorFile.fileType === FileType.Public) {
      return (
        (mirrorFile.content.content.postContent as PostContent)?.images ?? []
      );
    }
    if (mirrorFile.fileType === FileType.Private) {
      if (mirrorFile.isDecryptedSuccessfully) {
        return (
          (mirrorFile.content.content.postContent as PostContent)?.images ?? []
        );
      }
      return (
        Array.from<string>({
          length: mirrorFile.content.content.options?.lockedImagesNum!,
        }).fill("?") ?? []
      );
    }
    if (mirrorFile.fileType === FileType.Datatoken) {
      if (mirrorFile.isDecryptedSuccessfully) {
        return (
          (mirrorFile.content.content.postContent as PostContent)?.images ?? []
        );
      }
      return (
        Array.from<string>({
          length: mirrorFile.content.content.options?.lockedImagesNum!,
        }).fill("?") ?? []
      );
    }
    return [];
  };

  useEffect(() => {
    setImages(showImage(mirrorFile));
  }, [mirrorFile]);

  const CurrentImgWrapper = images.length < 4 ? ImgWrapper : ImageWrapperGrid
  return (
    <CurrentImgWrapper>
      {images.map((image, index) => {
        if (image === "?") {
          return <div> <Image key={"image" + index} src={question} imgCount={1} /></div>;
        } else {
          return <Image key={"image" + index} imgCount={images.length < 4 ? images.length : 1} src={image}></Image>;
        }
      })}
    </CurrentImgWrapper >
  );
};

export default Images;
