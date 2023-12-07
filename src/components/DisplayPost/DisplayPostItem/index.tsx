import { PropsWithRef, useCallback, useEffect, useState } from "react";
import React from "react";

import { Message } from "@arco-design/web-react";
import {
  Chain,
  ChainId,
  DatatokenType,
  FileType,
  MirrorFile,
  SYSTEM_CALL,
  WALLET,
} from "@dataverse/dataverse-connector";
import {
  MutationStatus,
  useAction,
  useCollectFile,
  useLoadDatatokens,
  useProfiles,
  useStore,
  useUnlockFile,
} from "@dataverse/hooks";

import Images from "./Images";
import { Wrapper, Content, CreatedAt } from "./styled";
import { Header } from "./styled";
import Text from "./Text";
import UnlockInfo from "./UnlockInfo";

import AccountStatus from "@/components/AccountStatus";
import { CreateLensProfile } from "@/components/CreateLensProfile";
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
  isBatchGettingDatatokenInfo?: boolean;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({
  fileId,
  connectApp,
  isBatchGettingDatatokenInfo,
}) => {
  // const navigate = useNavigate();
  const { postModelId } = usePlaygroundStore();

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [nftLocked, setNftLocked] = useState<boolean>(false);
  const [autoUnlocking, setAutoUnlocking] = useState<boolean>(false);
  const [isCreateProfileModalVisible, setCreateProfileModalVisible] =
    useState<boolean>(false);
  const [createProfilesFn, setCreateProfilesFn] = useState<{
    onFinished: (profileId: string) => void;
    onCancel: () => void;
  }>();

  const { browserStorage } = usePlaygroundStore();

  const { actionUpdateDatatokenInfo, actionUpdateFile } = useAction();

  const { isDataverseExtension, setNoExtensionModalVisible } =
    usePlaygroundStore();
  const {
    pkh,
    filesMap: _filesMap,
    dataverseConnector,
    address,
    profileIds,
  } = useStore();
  const filesMap = _filesMap?.[postModelId];

  const { getProfiles } = useProfiles();
  const { isPending: isGettingDatatokenInfo, loadDatatokens } =
    useLoadDatatokens({
      onSuccess: result => {
        browserStorage.getDatatokenInfo(fileId).then(storedDatatokenInfo => {
          if (
            !storedDatatokenInfo ||
            JSON.stringify(storedDatatokenInfo) !== JSON.stringify(result)
          ) {
            browserStorage.setDatatokenInfo({
              fileId: fileId,
              datatokenInfo: result[0],
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
      loadDatatokens([fileId]);
    },
  });

  const { collectFile } = useCollectFile({
    onError: (error: any) => {
      console.error(error);
      Message.error(error?.message ?? error);
    },
  });

  useEffect(() => {
    console.log({ pkh, address });
  }, [pkh, address]);

  const autoUnlock = useCallback(async () => {
    const res = await browserStorage.getDecryptedFileContent({
      pkh,
      fileId: fileId,
    });
    if (res) return;
    if (isUnlocking) return;

    try {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }

      if (!pkh) {
        return;
      }

      // if (isUnlocking) {
      //   throw new Error("cannot unlock");
      // }
      setAutoUnlocking(true);
      setIsUnlocking(true);

      const isCollected = await dataverseConnector.runOS({
        // method: SYSTEM_CALL.checkIsDataTokenCollectedByAddress,
        method: SYSTEM_CALL.isDatatokenCollectedBy,
        params: {
          datatokenId:
            filesMap![fileId].accessControl!.monetizationProvider!.datatokenId!,
          collector: address!,
        },
      });
      if (isCollected) {
        await unlockFile(fileId);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setAutoUnlocking(false);
      setIsUnlocking(false);
    }
  }, [
    browserStorage,
    isUnlocking,
    isDataverseExtension,
    dataverseConnector,
    pkh,
    address,
  ]);

  useEffect(() => {
    (async () => {
      if (
        !isBatchGettingDatatokenInfo &&
        !isGettingDatatokenInfo &&
        filesMap![fileId].fileType === FileType.PayableFileType &&
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
        loadDatatokens([fileId]);
      }

      if (
        browserStorage &&
        isDataverseExtension &&
        !isUnlocking &&
        !isUnlockSucceed &&
        filesMap![fileId].fileType !== FileType.PublicFileType
      ) {
        const fileContent = await browserStorage.getDecryptedFileContent({
          pkh,
          fileId,
        });
        // console.log(fileContent?.file.fileName, { fileContent });
        if (
          fileContent &&
          fileContent.file.updatedAt === filesMap![fileId].updatedAt
        ) {
          actionUpdateFile({
            ...fileContent,
            ...fileContent.file,
            content: fileContent.content,
          });
          setUnlockStatus(MutationStatus.Succeed);
        } else {
          autoUnlock();
        }
      }
    })();
  }, [browserStorage, filesMap![fileId], pkh]);

  const unlock = useCallback(async () => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    try {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }

      if (!pkh) {
        await connectApp!();
      }

      // if (isUnlocking) {
      //   throw new Error("cannot unlock");
      // }

      const isCollected = await dataverseConnector.runOS({
        // method: SYSTEM_CALL.checkIsDataTokenCollectedByAddress,
        method: SYSTEM_CALL.isDatatokenCollectedBy,
        params: {
          datatokenId:
            filesMap![fileId].accessControl!.monetizationProvider!.datatokenId!,
          collector: address ?? dataverseConnector.address!,
        },
      });
      if (!isCollected) {
        let targetProfileIds: string[];
        if (!profileIds) {
          const lensProfiles = await getProfiles({
            chainId: ChainId.PolygonMumbai,
            accountAddress: address!,
          });
          targetProfileIds = lensProfiles;
        } else {
          targetProfileIds = profileIds;
        }
        if (targetProfileIds.length === 0) {
          Message.info("Please create a lens profile first");
          setCreateProfileModalVisible(true);
          // return;
          try {
            await new Promise((resolve, reject) => {
              setCreateProfilesFn({
                onFinished: (profileId: string) => {
                  resolve(profileId);
                },
                onCancel: () => {
                  reject("user canceled");
                },
              });
            });
          } catch (e) {
            console.warn(e);
            return;
          }
        }
        await collectFile({
          fileId: filesMap![fileId].fileId,
          ...(filesMap![fileId].accessControl?.monetizationProvider
            ?.protocol === DatatokenType.Lens && {
            profileId: targetProfileIds[0],
          }),
        });
      }
      try {
        await unlockFile(fileId);
        setNftLocked(false);
      } catch (e) {
        console.warn(e);
        Message.error(e as any);
        const file = filesMap![fileId] as MirrorFile;
        const isNftLocked = !!(
          file.accessControl?.monetizationProvider?.unlockingTimeStamp &&
          Number(file.accessControl.monetizationProvider.unlockingTimeStamp) >
            Date.now() / 1000
        );
        if (isNftLocked) {
          setNftLocked(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUnlocking(false);
    }
  }, [isUnlocking, isDataverseExtension, pkh, address, filesMap![fileId]]);

  return (
    <Wrapper>
      <Content>
        <Header>
          <FlexRow>
            <AccountStatus
              name={
                addressAbbreviation(
                  getAddressFromDid(filesMap![fileId].pkh!),
                ) ?? ""
              }
              did={filesMap![fileId].pkh!}
            />
            <CreatedAt>
              {"• " + timeAgo(Date.parse(filesMap![fileId].content.createdAt))}
            </CreatedAt>
          </FlexRow>
          {filesMap![fileId].fileType !== FileType.PublicFileType && (
            <UnlockInfo
              streamRecord={filesMap![fileId]}
              isPending={!autoUnlocking && isUnlocking}
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
          nftLocked={nftLocked}
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
      <CreateLensProfile
        isModalVisible={isCreateProfileModalVisible}
        setModalVisible={setCreateProfileModalVisible}
        onFinished={createProfilesFn?.onFinished}
        onCancel={createProfilesFn?.onCancel}
      />
    </Wrapper>
  );
};

export default DisplayPostItem;
