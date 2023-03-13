import AccountStatus from "../AccountStatus";
import { DisplayPostItemProps } from "./types";
import { didAbbreviation } from "@/utils/didAndAddress";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayMyPosts, folderSlice } from "@/state/folder/slice";
// @ts-ignore
import JSONFormatter from "json-formatter-js";
import { oldAppVersion } from "@/sdk";
import { FileType } from "@dataverse/runtime-connector";
import { Wrapper, Content } from "@/components/PublishPost/styled";
import { decryptPost } from "@/state/post/slice";
import React from "react";
import { buyFile, monetizeFile } from "@/state/file/slice";
import { CustomMirror, CustomMirrorFile, PostContent } from "@/types";

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ stream }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  const posts = useSelector((state) => state.folder.posts);
  const currentMirror = useSelector((state) => state.folder.currentMirror);

  useEffect(() => {
    dispatch(displayMyPosts(did));
  }, [did]);

  const openDecryptionModel = (mirror: CustomMirror) => {
    dispatch(folderSlice.actions.setCurrentMirror(mirror));
  };

  useEffect(() => {
    if (currentMirror) {
      const myJSON = currentMirror.mirrorFile.decryptionConditions;
      const formatter = new JSONFormatter(myJSON);
      document
        .querySelector(`#${currentMirror.mirrorId} .childrenContainer`)
        ?.appendChild(formatter.render());
      formatter.openAtDepth(Infinity);
    } else {
    }
  }, [currentMirror]);

  const closeDecryptionModel = () => {
    if (!currentMirror) {
      return;
    }
    document.querySelector(`.json-formatter-open`)?.remove();
    dispatch(folderSlice.actions.setCurrentMirror());
  };

  const decrypt = () => {
    if (currentMirror?.mirrorFile?.isDecrypting) return;
    dispatch(decryptPost({ did, mirrorFile: currentMirror?.mirrorFile! }));
  };

  const monetize = (mirrorFile: CustomMirrorFile) => {
    if (mirrorFile.isMonetizing) return;
    dispatch(monetizeFile({ did, mirrorFile }));
  };

  const buy = (mirrorFile: CustomMirrorFile) => {
    if (mirrorFile?.isBuying) return;
    dispatch(buyFile({ did, mirrorFile }));
  };
  console.log(posts);

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

  return (
    <Wrapper>
      <Content>
        <AccountStatus name={didAbbreviation(did) ?? ''} avatar={""} />
      </Content>
    </Wrapper>
  )
}

export default DisplayPostItem
