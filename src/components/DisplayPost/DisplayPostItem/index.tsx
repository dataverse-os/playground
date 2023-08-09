import AccountStatus from "@/components/AccountStatus";
import { addressAbbreviation, getAddressFromDid, timeAgo } from "@/utils";
import { PropsWithRef, useEffect, useMemo, useState } from "react";
import { FileType } from "@dataverse/dataverse-connector";
import { Wrapper, Content, CreatedAt, Footer } from "./styled";
import React from "react";
import Text from "./Text";
import Images from "./Images";
import UnlockInfo from "./UnlockInfo";
import { Header } from "./styled";
import { FlexRow } from "@/styled";
import {
  useApp,
  useDatatokenInfo,
  useStore,
  useUnlockStream,
} from "@dataverse/hooks";
import { usePlaygroundStore } from "@/context";
import { Message } from "@arco-design/web-react";

interface DisplayPostItemProps extends PropsWithRef<any> {
  streamId: string;
  connectApp: Function;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({
  streamId,
  connectApp,
}) => {
  // const navigate = useNavigate();

  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);

  const { modelParser, isDataverseExtension, setNoExtensionModalVisible } =
    usePlaygroundStore();
  const { pkh, streamsMap } = useStore();
  const streamRecord = useMemo(() => {
    return streamsMap![streamId];
  }, [streamsMap]);

  const { isPending: isGettingDatatokenInfo, getDatatokenInfo } =
    useDatatokenInfo();

  const { isPending, isSucceed, unlockStream } = useUnlockStream({
    onError: (error: any) => {
      console.error(error);
      Message.error(error?.message ?? error);
    },
  });

  useEffect(() => {
    if (
      !isGettingDatatokenInfo &&
      streamRecord.streamContent.file.fileType === FileType.Datatoken &&
      !streamRecord.datatokenInfo
    ) {
      getDatatokenInfo(streamId);
    }
  }, [streamsMap]);

  const unlock = async () => {
    setIsUnlocking(true);
    try {
      if (isDataverseExtension === false) {
        setNoExtensionModalVisible(true);
        return;
      }

      if (!pkh) {
        await connectApp({ appId: modelParser.appId });
      }

      if (isUnlocking || isSucceed) {
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
                addressAbbreviation(getAddressFromDid(streamRecord.pkh)) ?? ""
              }
              did={streamRecord.pkh}
            />
            <CreatedAt>
              {"• " +
                timeAgo(
                  Date.parse(streamRecord.streamContent.content.createdAt)
                )}
            </CreatedAt>
          </FlexRow>
          {streamRecord.streamContent.file.fileType !== FileType.Public && (
            <UnlockInfo
              streamRecord={streamRecord}
              isPending={isPending}
              isSucceed={isSucceed}
              unlock={unlock}
            />
          )}
        </Header>

        <Text
          streamRecord={streamRecord}
          isUnlockSucceed={isSucceed}
          onClick={() => {
            // navigate("/post/" + streamRecord.streamId);
          }}
        />
        <Images
          streamRecord={streamRecord}
          isUnlockSucceed={isSucceed}
          isGettingDatatokenInfo={isGettingDatatokenInfo}
          onClick={() => {
            // navigate("/post/" + streamRecord.streamId);
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
