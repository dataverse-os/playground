import { FileType, StreamRecord } from "@dataverse/dataverse-connector";
import { TextWrapper } from "./styled";
import React from "react";
import { CustomMirrorFile } from "@/types";

export interface TextProps {
  streamRecord: StreamRecord;
  isUnlockSucceed: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Text: React.FC<TextProps> = ({ streamRecord, isUnlockSucceed, onClick }) => {
  const getContent = () => {
    if (streamRecord.streamContent.file.fileType === FileType.Public) {
      return streamRecord.streamContent.content.text;
    }
    if (streamRecord.streamContent.file.fileType === FileType.Private) {
      if (isUnlockSucceed) {
        return streamRecord.streamContent.content?.text;
      }
      return "";
    }
    if (streamRecord.streamContent.file.fileType === FileType.Datatoken) {
      if (isUnlockSucceed) {
        return streamRecord.streamContent.content?.text;
      }
      return "" as string;
    }
  };
  return <TextWrapper onClick={onClick}>{getContent()}</TextWrapper>;
};

export default Text;
