import React, { useEffect, useState } from "react";

import {
  FileType,
  ReturnType,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";

import { Image, ImgWrapper, ImageWrapperGrid } from "./styled";

import question from "@/assets/icons/question.png";

interface ImagesProps {
  fileRecord: Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
  isUnlockSucceed: boolean;
  isGettingDatatokenInfo: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Images: React.FC<ImagesProps> = ({
  fileRecord,
  isUnlockSucceed,
  isGettingDatatokenInfo,
  onClick,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const showImage = (fileRecord: Awaited<ReturnType[SYSTEM_CALL.loadFile]>) => {
    if (fileRecord.fileContent.file.fileType === FileType.PublicFileType) {
      return fileRecord.fileContent.content?.images ?? [];
    }
    if (fileRecord.fileContent.file.fileType === FileType.PrivateFileType) {
      if (isUnlockSucceed) {
        return fileRecord.fileContent.content?.images ?? [];
      }
      return (
        Array.from<string>({
          length: 1,
        }).fill("?") ?? []
      );
    }
    if (fileRecord.fileContent.file.fileType === FileType.PayableFileType) {
      if (isUnlockSucceed) {
        return fileRecord.fileContent.content?.images ?? [];
      }
      return (
        Array.from<string>({
          length: 1,
        }).fill("?") ?? []
      );
    }
    return [];
  };

  useEffect(() => {
    if (isGettingDatatokenInfo) return;
    let nowImages = showImage(fileRecord);
    if (
      nowImages.length === 0 &&
      fileRecord.fileContent.file.fileType !== FileType.PublicFileType &&
      !isUnlockSucceed
    ) {
      nowImages = ["?"];
    }
    nowImages = [...new Set(Array.from(nowImages))];
    setImages(nowImages);
  }, [fileRecord, isUnlockSucceed]);

  const CurrentImgWrapper = images.length < 4 ? ImgWrapper : ImageWrapperGrid;
  return (
    <CurrentImgWrapper onClick={onClick}>
      {images?.map((image, index) => {
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
