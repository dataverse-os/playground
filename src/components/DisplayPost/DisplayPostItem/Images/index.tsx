import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { Secret, Image, ImgWrapper } from "./styled";
import React, { useEffect, useState } from "react";
import { CustomMirrorFile, PostContent } from "@/types";

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

  return (
    <ImgWrapper>
      {images.map((image, index) => {
        if (image === "?") {
          return <Secret key={"image" + index}>{image}</Secret>;
        } else {
          return <Image imgCount={images.length} src={image}></Image>;
        }
      })}
    </ImgWrapper>
  );
};

export default Images;
