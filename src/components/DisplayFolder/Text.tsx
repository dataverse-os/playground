import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { Wrapper } from "./styled";
import React from "react";
import { CustomMirrorFile, PostContent } from "@/types";

export interface TextProps {
  mirrorFile: CustomMirrorFile;
}

const Text: React.FC<TextProps> = ({ mirrorFile }) => {
  const showContent = (mirrorFile: CustomMirrorFile) => {
    if (mirrorFile.content.appVersion === oldAppVersion) {
      return mirrorFile.content.content as unknown as string;
    }
    if (mirrorFile.fileType === FileType.Public) {
      return (mirrorFile.content.content.postContent as PostContent)?.text;
    }
    if (mirrorFile.fileType === FileType.Private) {
      if (mirrorFile.isDecryptedSuccessfully) {
        return (mirrorFile.content.content.postContent as PostContent)?.text;
      }
      return mirrorFile.content.content.postContent as string;
    }
    if (mirrorFile.fileType === FileType.Datatoken) {
      if (mirrorFile.isBoughtSuccessfully) {
        return (mirrorFile.content.content.postContent as PostContent)?.text;
      }
      return mirrorFile.content.content.postContent as string;
    }
  };
  return <Wrapper>{showContent(mirrorFile)}</Wrapper>;
};

export default Text;
