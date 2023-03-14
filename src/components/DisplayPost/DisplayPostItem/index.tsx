import AccountStatus from "@/components/AccountStatus";
import {
  addressAbbreviation,
  didAbbreviation,
  getAddressFromDid,
} from "@/utils/didAndAddress";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayMyPosts, folderSlice } from "@/state/folder/slice";
// @ts-ignore
import JSONFormatter from "json-formatter-js";
import { oldAppVersion } from "@/sdk";
import { FileType, StreamObject } from "@dataverse/runtime-connector";
import { Wrapper, Content } from "./styled";
import { decryptPost } from "@/state/post/slice";
import React from "react";
import { buyFile, monetizeFile } from "@/state/file/slice";
import { CustomMirror, CustomMirrorFile, PostContent } from "@/types";
import Text from "./Text";
import Images from "./Images";
import UnlockInfo from "./UnlockInfo";
import { Header } from "./styled";

interface DisplayPostItemProps {
  mirror: CustomMirror;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ mirror }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

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
      if (mirrorFile.hasBoughtSuccessfully) {
        return (mirrorFile.content.content.postContent as PostContent)?.text;
      }
      return mirrorFile.content.content.postContent as string;
    }
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          <AccountStatus
            name={addressAbbreviation(getAddressFromDid(did)) ?? ""}
          />
          {mirror.mirrorFile.fileType !== FileType.Public && (
            <UnlockInfo mirror={mirror} />
          )}
        </Header>
        <Text mirrorFile={mirror.mirrorFile} />
        <Images mirrorFile={mirror.mirrorFile} />
      </Content>
    </Wrapper>
  );
};

export default DisplayPostItem;
