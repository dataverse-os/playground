import { useAppDispatch, useSelector } from "@/state/hook";
import { useCallback, useEffect, useRef } from "react";
import { displayDefaultFolder, folderSlice } from "@/state/folder/slice";
// @ts-ignore
import JSONFormatter from "json-formatter-js";
import { appName } from "@/sdk";
import {
  FileType,
  Mirror,
  MirrorFile,
  ModelNames,
} from "@dataverse/runtime-connector";
import {
  Wrapper,
  PostWapper,
  ButtonWrapper,
  Content,
  Title,
  ContentWrapper,
} from "./styled";
import Button from "../Button";
import { decryptPost } from "@/state/post/slice";
import Modal from "../Modal";
import React from "react";
import { css } from "styled-components";

export interface PublishPostProps {}

const DisplayPostInFolder: React.FC<PublishPostProps> = ({}) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  const folder = useSelector((state) => state.folder.folder);
  const currentMirror = useSelector((state) => state.folder.currentMirror);

  useEffect(() => {
    dispatch(displayDefaultFolder(did));
  }, [did]);

  const openDecryptionModel = (mirror: Mirror) => {
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
    dispatch(decryptPost({ did, mirrorFile: currentMirror?.mirrorFile! }));
  };

  return (
    <Wrapper>
      <Title>File Stream</Title>
      <ContentWrapper>
        <Content>
          {folder &&
            folder.mirrors.map((mirror, index) => (
              <PostWapper
                key={mirror.mirrorId}
                marginTop={index === 0 ? 0 : 24}
              >
                {mirror.mirrorFile.appName === appName &&
                mirror.mirrorFile.modelName === ModelNames.post
                  ? mirror.mirrorFile.content.content
                  : mirror.mirrorFile.contentId}
                {mirror.mirrorFile.fileType === FileType.Private &&
                  !mirror.mirrorFile.isDecryptedSuccessfully && (
                    <ButtonWrapper>
                      <Button
                        loading={mirror.mirrorFile.isDecrypting}
                        onClick={() => openDecryptionModel(mirror)}
                      >
                        Decrypt
                      </Button>
                    </ButtonWrapper>
                  )}
              </PostWapper>
            ))}
        </Content>
      </ContentWrapper>
      <Modal
        id={currentMirror?.mirrorId}
        title="Conditions"
        mask
        width={800}
        controlVisible={!!currentMirror}
        showCloseButton
        onOk={decrypt}
        onCancel={closeDecryptionModel}
        cssStyle={css`
          .headerContainer {
            font-size: 24px;
            font-weight: 500;
          }
        `}
      ></Modal>
    </Wrapper>
  );
};

export default DisplayPostInFolder;
