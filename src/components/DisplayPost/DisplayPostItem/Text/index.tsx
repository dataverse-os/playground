import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { TextWrapper } from "./styled";
import React from "react";
import { CustomMirrorFile, Post, PostContent, PostStream } from "@/types";

export interface TextProps {
  postStream: PostStream;
}

const Text: React.FC<TextProps> = ({ postStream }) => {
  const showContent = (postStream: PostStream) => {
    if (postStream.streamContent.appVersion === oldAppVersion) {
      return (postStream.streamContent.content as any)?.content;
    }
    if (postStream.streamContent.indexFile.fileType === FileType.Public) {
      return (
        (postStream.streamContent.content as Post).postContent as PostContent
      )?.text;
    }
    if (postStream.streamContent.indexFile.fileType === FileType.Private) {
      if (postStream.isDecryptedSuccessfully) {
        return (
          (postStream.streamContent.content as Post).postContent as PostContent
        )?.text;
      }
      return '';
    }
    if (postStream.streamContent.indexFile.fileType === FileType.Datatoken) {
      if (postStream.isDecryptedSuccessfully) {
        return (
          (postStream.streamContent.content as Post).postContent as PostContent
        )?.text;
      }
      return '' as string;
    }
  };
  return <TextWrapper>{showContent(postStream)}</TextWrapper>;
};

export default Text;
