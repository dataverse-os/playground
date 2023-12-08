import React, { useEffect, useState } from "react";

import { FileType, MirrorFile } from "@dataverse/dataverse-connector";
import { DatatokenInfo, FileResult } from "@dataverse/hooks";
import dayjs from "dayjs";

import { Image, ImgWrapper, ImageWrapperGrid, NftLockedInfo } from "./styled";

// import iconLock from "@/assets/icons/lock-white.svg";
import question from "@/assets/icons/question.png";
import { timeCountdown } from "@/utils";

interface ImagesProps {
  fileRecord: MirrorFile &
    Partial<FileResult> & {
      datatokenInfo?: DatatokenInfo;
    };
  isUnlockSucceed: boolean;
  isGettingDatatokenInfo: boolean;
  // nftLocked?: boolean;
  isCollected?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Images: React.FC<ImagesProps> = ({
  fileRecord,
  isUnlockSucceed,
  isGettingDatatokenInfo,
  // nftLocked,
  isCollected,
  onClick,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const showImage = (fileRecord: MirrorFile & Partial<FileResult>) => {
    if (fileRecord.fileType === FileType.PublicFileType) {
      return fileRecord.content?.images ?? [];
    }
    if (fileRecord.fileType === FileType.PrivateFileType) {
      if (isUnlockSucceed) {
        return fileRecord.content?.images ?? [];
      }
      return (
        Array.from<string>({
          length: 1,
        }).fill("?") ?? []
      );
    }
    if (fileRecord.fileType === FileType.PayableFileType) {
      if (isUnlockSucceed) {
        return fileRecord.content?.images ?? [];
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
      fileRecord.fileType !== FileType.PublicFileType &&
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
          // return (
          //   <Image
          //     key={"image" + index}
          //     src={question}
          //     imgCount={images.length < 4 ? images.length : 1}
          //   />
          // );
          return (
            <NftLockedInfo key={index}>
              <Image src={question} imgCount={1} />
              {(fileRecord.accessControl?.monetizationProvider
                ?.unlockingTimeStamp ||
                (fileRecord.datatokenInfo as any)?.end_timestamp) && (
                <div className='mask'>
                  {/* <div className='locked-icon'>
                      <img src={iconLock} />
                    </div> */}
                  <div className='info-card'>
                    {!isCollected &&
                    (fileRecord.datatokenInfo as any)?.end_timestamp ? (
                      <p>
                        End of collect time:{" "}
                        {dayjs(
                          Number(
                            (fileRecord.datatokenInfo as any).end_timestamp,
                          ) * 1000,
                        ).format("YYYY/MM/DD HH:mm")}
                      </p>
                    ) : fileRecord.accessControl?.monetizationProvider
                        ?.unlockingTimeStamp ? (
                      <p>
                        unlock in{" "}
                        {timeCountdown(
                          Number.parseInt(
                            fileRecord.accessControl.monetizationProvider
                              .unlockingTimeStamp,
                          ) * 1000,
                        ) || "just now"}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </NftLockedInfo>
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
