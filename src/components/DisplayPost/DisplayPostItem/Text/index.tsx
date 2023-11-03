import React from "react";

import {
  FileType,
  ReturnType,
  SYSTEM_CALL,
} from "@dataverse/dataverse-connector";

import { TextWrapper } from "./styled";

interface TextProps {
  fileRecord: Awaited<ReturnType[SYSTEM_CALL.loadFile]>;
  isUnlockSucceed: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Text: React.FC<TextProps> = ({
  fileRecord,
  isUnlockSucceed,
  onClick,
}) => {
  const getContent = () => {
    if (fileRecord.fileContent.file.fileType === FileType.PublicFileType) {
      return fileRecord.fileContent.content.text;
    }
    if (fileRecord.fileContent.file.fileType === FileType.PrivateFileType) {
      if (isUnlockSucceed) {
        return fileRecord.fileContent.content?.text;
      }
      return "";
    }
    if (fileRecord.fileContent.file.fileType === FileType.PayableFileType) {
      if (isUnlockSucceed) {
        return fileRecord.fileContent.content?.text;
      }
      return "" as string;
    }
  };
  return <TextWrapper onClick={onClick}>{getContent()}</TextWrapper>;
};

export default Text;
