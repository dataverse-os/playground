import { useAppDispatch, useSelector } from "@/state/hook";
import { useCallback, useEffect, useRef } from "react";
import { displayDefaultFolder, folderSlice } from "@/state/folder/slice";
// @ts-ignore
import JSONFormatter from "json-formatter-js";
import { appName } from "@/sdk";
import {
  Currency,
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
  Link,
  LinkWrapper,
} from "./styled";
import Button from "../Button";
import { decryptPost } from "@/state/post/slice";
import Modal from "../Modal";
import React from "react";
import { css } from "styled-components";
import { buyFile, monetizeFile } from "@/state/file/slice";
import { CustomMirror, CustomMirrorFile } from "@/types";

export interface PublishPostProps {}

const DisplayPostInFolder: React.FC<PublishPostProps> = ({}) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  const folder = useSelector((state) => state.folder.folder);
  const currentMirror = useSelector((state) => state.folder.currentMirror);

  useEffect(() => {
    dispatch(displayDefaultFolder(did));
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
                <ButtonWrapper>
                  {mirror.mirrorFile.fileType === FileType.Private &&
                    !mirror.mirrorFile.isDecryptedSuccessfully && (
                      <Button
                        loading={mirror.mirrorFile.isDecrypting}
                        css={css`
                          margin-right: 20px;
                        `}
                        onClick={() => openDecryptionModel(mirror)}
                      >
                        Decrypt
                      </Button>
                    )}
                  {mirror.mirrorFile.fileType !== FileType.Datatoken &&
                    !mirror.mirrorFile.isMonetizedSuccessfully && (
                      <Button
                        loading={mirror.mirrorFile.isMonetizing}
                        onClick={() => monetize(mirror.mirrorFile)}
                      >
                        Monetize
                      </Button>
                    )}
                  {mirror.mirrorFile.fileType === FileType.Datatoken &&
                    !mirror.mirrorFile.isBoughtSuccessfully && (
                      <>
                        <Button
                          loading={mirror.mirrorFile.isBuying}
                          onClick={() => buy(mirror.mirrorFile)}
                        >
                          Buy
                        </Button>
                        {/* {mirror.mirrorFile.} */}
                      </>
                    )}
                </ButtonWrapper>
              </PostWapper>
            ))}
        </Content>
        <LinkWrapper>
          <Link href="https://d3kl77fsqciqs4.cloudfront.net/" target="_blank">
            View on DataverseOS File System.
          </Link>
        </LinkWrapper>
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
