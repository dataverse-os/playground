import React from "react";

import { FileType, MirrorFile } from "@dataverse/dataverse-connector";
import { DatatokenInfo, FileResult } from "@dataverse/hooks";

import { TextWrapper } from "./styled";

interface TextProps {
  fileRecord: MirrorFile & Partial<FileResult>;
  datatokenInfo?: DatatokenInfo;
  isUnlockSucceed: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Text: React.FC<TextProps> = ({
  fileRecord,
  isUnlockSucceed,
  onClick,
}) => {
  const getContent = () => {
    if (fileRecord.fileType === FileType.PublicFileType) {
      return fileRecord.content.text;
    }
    if (fileRecord.fileType === FileType.PrivateFileType) {
      if (isUnlockSucceed) {
        return fileRecord.content?.text;
      }
      return "";
    }
    if (fileRecord.fileType === FileType.PayableFileType) {
      if (isUnlockSucceed) {
        return fileRecord.content?.text;
      }
      return "" as string;
    }
  };
  return <TextWrapper onClick={onClick}>{getContent()}</TextWrapper>;
};

export default Text;
