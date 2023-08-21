import { PropsWithRef, useEffect, useState } from "react";
import React from "react";

import { Message } from "@arco-design/web-react";
import { Chain, FileType, WALLET } from "@dataverse/dataverse-connector";
import {
  MutationStatus,
  useAction,
  useDatatokenInfo,
  useStore,
  useUnlockStream,
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
  streamId: string;
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
  streamId,
  connectApp,
}) => {
  // const navigate = useNavigate();

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const { browserStorage } = usePlaygroundStore();

  const { actionUpdateDatatokenInfo, actionUpdateStream } = useAction();

  const { isDataverseExtension, setNoExtensionModalVisible } =
    usePlaygroundStore();
  const { pkh, streamsMap } = useStore();

  const { isPending: isGettingDatatokenInfo, getDatatokenInfo } =
    useDatatokenInfo({
      onSuccess: result => {
        browserStorage.getDatatokenInfo(streamId).then(storedDatatokenInfo => {
          if (
            !storedDatatokenInfo ||
            JSON.stringify(storedDatatokenInfo) !== JSON.stringify(result)
          ) {
            browserStorage.setDatatokenInfo({
              streamId,
              datatokenInfo: result,
            });
          }
        });
      },
    });

  const {
    isSucceed: isUnlockSucceed,
    setStatus: setUnlockStatus,
    unlockStream,
  } = useUnlockStream({
    onError: (error: any) => {
      console.error(error);
      Message.error(error?.message ?? error);
    },
    onSuccess: result => {
      browserStorage.getDecryptedStreamContent({ pkh, streamId }).then(res => {
        if (!res) {
          browserStorage.setDecryptedStreamContent({
            pkh,
            streamId,
            ...result,
          });
        }
      });
      getDatatokenInfo(streamId);
    },
  });

  useEffect(() => {
    (async () => {
      if (
        !isGettingDatatokenInfo &&
        streamsMap![streamId].streamContent.file.fileType ===
          FileType.Datatoken &&
        !streamsMap![streamId].datatokenInfo
      ) {
        const datatokenInfo = await browserStorage.getDatatokenInfo(streamId);
        if (datatokenInfo) {
          // assign state from local storage cache
          actionUpdateDatatokenInfo({
            streamId,
            datatokenInfo,
          });
        }
        // refresh sold_num
        getDatatokenInfo(streamId);
      }

      if (
        browserStorage &&
        isDataverseExtension &&
        !isUnlocking &&
        !isUnlockSucceed &&
        streamsMap![streamId].streamContent.file.fileType !== FileType.Public
      ) {
        const streamContent = await browserStorage.getDecryptedStreamContent({
          pkh,
          streamId,
        });
        if (
          streamContent &&
          (streamContent.content as any).updatedAt ===
            streamsMap![streamId].streamContent.content.updatedAt
        ) {
          actionUpdateStream({ streamId, streamContent });
          setUnlockStatus(MutationStatus.Succeed);
        }
      }
    })();
  }, [browserStorage, streamsMap![streamId]]);

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

      await unlockStream(streamId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          <FlexRow>
            <AccountStatus
              name={
                addressAbbreviation(
                  getAddressFromDid(streamsMap![streamId].pkh),
                ) ?? ""
              }
              did={streamsMap![streamId].pkh}
            />
            <CreatedAt>
              {"• " +
                timeAgo(
                  Date.parse(
                    streamsMap![streamId].streamContent.content.createdAt,
                  ),
                )}
            </CreatedAt>
          </FlexRow>
          {streamsMap![streamId].streamContent.file.fileType !==
            FileType.Public && (
            <UnlockInfo
              streamRecord={streamsMap![streamId]}
              isPending={isUnlocking}
              isSucceed={isUnlockSucceed}
              unlock={unlock}
            />
          )}
        </Header>

        <Text
          streamRecord={streamsMap![streamId]}
          isUnlockSucceed={isUnlockSucceed}
          onClick={() => {
            // navigate("/post/" + streamsMap![streamId].streamId);
          }}
        />
        <Images
          streamRecord={streamsMap![streamId]}
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
