import React, { useEffect, useState } from "react";

import {
  FileType,
  ReturnType,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";

import { Image, ImgWrapper, ImageWrapperGrid, NftLockedInfo } from "./styled";

import iconLock from "@/assets/icons/lock-white.svg";
import question from "@/assets/icons/question.png";
import { timeCountdown } from "@/utils";

interface ImagesProps {
  fileRecord: Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
  isUnlockSucceed: boolean;
  isGettingDatatokenInfo: boolean;
  nftLocked?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Images: React.FC<ImagesProps> = ({
  fileRecord,
  isUnlockSucceed,
  isGettingDatatokenInfo,
  nftLocked,
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
      {!nftLocked &&
        images?.map((image, index) => {
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
      {nftLocked && (
        <NftLockedInfo>
          <div className='locked-icon'>
            <img src={iconLock} />
          </div>
          <div className='info-card'>
            <p>unlock in</p>
            <p>
              {fileRecord.fileContent.file.accessControl?.monetizationProvider
                ?.unlockingTimeStamp
                ? timeCountdown(
                    fileRecord.fileContent.file.accessControl
                      ?.monetizationProvider?.unlockingTimeStamp * 1000,
                  ) || "just now"
                : "?"}
            </p>
          </div>
        </NftLockedInfo>
      )}
    </CurrentImgWrapper>
  );
};

export default Images;
