import { PropsWithRef, useEffect, useState } from "react";
import React from "react";

import { Message } from "@arco-design/web-react";
import {
  Chain,
  FileType,
  SYSTEM_CALL,
  WALLET,
} from "@dataverse/dataverse-connector";
import {
  MutationStatus,
  useAction,
  useCollectFile,
  useDatatokenInfo,
  useStore,
  useUnlockFile,
} from "@dataverse/hooks";

import Images from "./Images";
import { Wrapper, Content, CreatedAt } from "./styled";
import { Header } from "./styled";
import Text from "./Text";
import UnlockInfo from "./UnlockInfo";

import AccountStatus from "@/components/AccountStatus";
import { usePlaygroundStore } from "@/context";
import { FlexRow } from "@/styled";
import { addressAbbreviation, getAddressFromDid, timeAgo } from "@/utils";

interface DisplayPostItemProps extends PropsWithRef<any> {
  fileId: string;
  connectApp?: (args?: {
    wallet?: WALLET | undefined;
    provider?: any;
  }) => Promise<{
    pkh: string;
    address: string;
    chain: Chain;
    wallet: WALLET;
  }>;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({
  fileId,
  connectApp,
}) => {
  // const navigate = useNavigate();

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const { browserStorage } = usePlaygroundStore();

  const { actionUpdateDatatokenInfo, actionUpdateFile } = useAction();

  const { isDataverseExtension, setNoExtensionModalVisible } =
    usePlaygroundStore();
  const { pkh, filesMap, dataverseConnector, address } = useStore();

  const { isPending: isGettingDatatokenInfo, getDatatokenInfo } =
    useDatatokenInfo({
      onSuccess: result => {
        browserStorage.getDatatokenInfo(fileId).then(storedDatatokenInfo => {
          if (
            !storedDatatokenInfo ||
            JSON.stringify(storedDatatokenInfo) !== JSON.stringify(result)
          ) {
            browserStorage.setDatatokenInfo({
              fileId: fileId,
              datatokenInfo: result,
            });
          }
        });
      },
    });

  const {
    isSucceed: isUnlockSucceed,
    setStatus: setUnlockStatus,
    unlockFile,
  } = useUnlockFile({
    onError: (error: any) => {
      if ("Already unlocked" === error) {
        setUnlockStatus(MutationStatus.Succeed);
        browserStorage
          .getDecryptedFileContent({ pkh, fileId: fileId })
          .then(res => {
            if (!res) {
              browserStorage.setDecryptedFileContent({
                pkh,
                fileId: fileId,
                fileContent: filesMap![fileId].fileContent as any,
              });
            }
          });
        return;
      }
      console.error(error);
      Message.error(error?.message ?? error);
    },
    onSuccess: result => {
      browserStorage
        .getDecryptedFileContent({ pkh, fileId: fileId })
        .then(res => {
          if (!res) {
            browserStorage.setDecryptedFileContent({
              pkh,
              fileId: fileId,
              ...result,
            });
          }
        });
      getDatatokenInfo(fileId);
    },
  });

  const { collectFile } = useCollectFile({
    onError: (error: any) => {
      console.error(error);
      Message.error(error?.message ?? error);
    },
  });

  useEffect(() => {
    (async () => {
      if (
        !isGettingDatatokenInfo &&
        filesMap![fileId].fileContent.file.fileType ===
          FileType.PayableFileType &&
        !filesMap![fileId].datatokenInfo
      ) {
        const datatokenInfo = await browserStorage.getDatatokenInfo(fileId);
        if (datatokenInfo) {
          // assign state from local storage cache
          actionUpdateDatatokenInfo({
            fileId,
            datatokenInfo,
          });
        }
        // refresh sold_num
        getDatatokenInfo(fileId);
      }

      if (
        browserStorage &&
        isDataverseExtension &&
        !isUnlocking &&
        !isUnlockSucceed &&
        filesMap![fileId].fileContent.file.fileType !== FileType.PublicFileType
      ) {
        const fileContent = await browserStorage.getDecryptedFileContent({
          pkh,
          fileId,
        });
        console.log(fileContent?.file.fileName, { fileContent });
        if (
          fileContent &&
          fileContent.file.updatedAt ===
            filesMap![fileId].fileContent.file.updatedAt
        ) {
          actionUpdateFile({ fileId, fileContent });
          setUnlockStatus(MutationStatus.Succeed);
        }
      }
    })();
  }, [browserStorage, filesMap![fileId]]);

  const unlock = async () => {
    setIsUnlocking(true);
    try {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }

      if (!pkh) {
        await connectApp!();
      }

      if (isUnlocking) {
        throw new Error("cannot unlock");
      }

      const isCollected = await dataverseConnector.runOS({
        // method: SYSTEM_CALL.checkIsDataTokenCollectedByAddress,
        method: SYSTEM_CALL.isDatatokenCollectedBy,
        params: {
          datatokenId:
            filesMap![fileId].fileContent.file.accessControl
              .monetizationProvider.datatokenId,
          collector: address!,
        },
      });
      if (!isCollected) {
        await collectFile(filesMap![fileId].fileContent.file.fileId);
      }
      await unlockFile(fileId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUnlocking(false);
    }
  };

  useEffect(() => {
    if (
      filesMap![fileId].fileContent.file.fileType === FileType.PayableFileType
    ) {
      (async () => {
        const res = await browserStorage.getDecryptedFileContent({
          pkh,
          fileId: fileId,
        });
        if (res) return;

        try {
          setIsUnlocking(true);
          if (isDataverseExtension === false) {
            setNoExtensionModalVisible(true);
            return;
          }

          if (!pkh) {
            await connectApp!();
          }

          if (isUnlocking) {
            throw new Error("cannot unlock");
          }

          const isCollected = await dataverseConnector.runOS({
            // method: SYSTEM_CALL.checkIsDataTokenCollectedByAddress,
            method: SYSTEM_CALL.isDatatokenCollectedBy,
            params: {
              datatokenId:
                filesMap![fileId].fileContent.file.accessControl
                  .monetizationProvider.datatokenId,
              collector: address!,
            },
          });
          if (isCollected) {
            await unlockFile(fileId);
          }
        } catch (error) {
          console.warn(error);
        } finally {
          setIsUnlocking(false);
        }
      })();
    }
  }, [filesMap![fileId]]);

  return (
    <Wrapper>
      <Content>
        <Header>
          <FlexRow>
            <AccountStatus
              name={
                addressAbbreviation(getAddressFromDid(filesMap![fileId].pkh)) ??
                ""
              }
              did={filesMap![fileId].pkh}
            />
            <CreatedAt>
              {"• " +
                timeAgo(
                  Date.parse(filesMap![fileId].fileContent.content.createdAt),
                )}
            </CreatedAt>
          </FlexRow>
          {filesMap![fileId].fileContent.file.fileType !==
            FileType.PublicFileType && (
            <UnlockInfo
              streamRecord={filesMap![fileId]}
              isPending={isUnlocking}
              isSucceed={isUnlockSucceed}
              unlock={unlock}
            />
          )}
        </Header>

        <Text
          fileRecord={filesMap![fileId]}
          isUnlockSucceed={isUnlockSucceed}
          onClick={() => {
            // navigate("/post/" + streamsMap![streamId].streamId);
          }}
        />
        <Images
          fileRecord={filesMap![fileId]}
          isUnlockSucceed={isUnlockSucceed}
          isGettingDatatokenInfo={isGettingDatatokenInfo}
          onClick={() => {
            // navigate("/post/" + streamsMap![streamId].streamId);
          }}
        />
        {/* <Footer>
          <a
            href={`${process.env.DATAVERSE_OS}/finder`}
            target="_blank"
            className="link"
          >
            View on DataverseOS File System
          </a>
        </Footer> */}
      </Content>
    </Wrapper>
  );
};

export default DisplayPostItem;
