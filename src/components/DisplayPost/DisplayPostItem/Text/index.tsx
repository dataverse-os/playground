import { FileType } from "@dataverse/core-connector";
import { TextWrapper } from "./styled";
import React from "react";
import { CustomMirrorFile, PostStream } from "@/types";

export interface TextProps {
  postStream: PostStream;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const Text: React.FC<TextProps> = ({ postStream, onClick }) => {
  const showContent = (postStream: PostStream) => {
    if (postStream.streamRecord.streamContent.file.fileType === FileType.Public) {
      return postStream.streamRecord.streamContent.content.text;
    }
    if (postStream.streamRecord.streamContent.file.fileType === FileType.Private) {
      if (postStream.hasUnlockedSuccessfully) {
        return postStream.streamRecord.streamContent.content?.text;
      }
      return "";
    }
    if (postStream.streamRecord.streamContent.file.fileType === FileType.Datatoken) {
      if (postStream.hasUnlockedSuccessfully) {
        return postStream.streamRecord.streamContent.content?.text;
      }
      return "" as string;
    }
  };
  return <TextWrapper onClick={onClick}>{showContent(postStream)}</TextWrapper>;
};

export default Text;
