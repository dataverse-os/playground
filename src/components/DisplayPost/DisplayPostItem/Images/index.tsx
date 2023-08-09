import { FileType, StreamRecord } from "@dataverse/dataverse-connector";
import { Image, ImgWrapper, ImageWrapperGrid } from "./styled";
import React, { useEffect, useState } from "react";
import question from "@/assets/icons/question.png";

interface ImagesProps {
  streamRecord: StreamRecord;
  isUnlockSucceed: boolean;
  isGettingDatatokenInfo: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Images: React.FC<ImagesProps> = ({
  streamRecord,
  isUnlockSucceed,
  isGettingDatatokenInfo,
  onClick,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const showImage = (streamRecord: StreamRecord) => {
    if (streamRecord.streamContent.file.fileType === FileType.Public) {
      return streamRecord.streamContent.content?.images ?? [];
    }
    if (streamRecord.streamContent.file.fileType === FileType.Private) {
      if (isUnlockSucceed) {
        return streamRecord.streamContent.content?.images ?? [];
      }
      return (
        Array.from<string>({
          length: 1,
        }).fill("?") ?? []
      );
    }
    if (streamRecord.streamContent.file.fileType === FileType.Datatoken) {
      if (isUnlockSucceed) {
        return streamRecord.streamContent.content?.images ?? [];
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
    let nowImages = showImage(streamRecord);
    if (
      nowImages.length === 0 &&
      streamRecord.streamContent.file.fileType !== FileType.Public &&
      !isUnlockSucceed
    ) {
      nowImages = ["?"];
    }
    nowImages = [...new Set(Array.from(nowImages))];
    setImages(nowImages);
  }, [streamRecord]);

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
