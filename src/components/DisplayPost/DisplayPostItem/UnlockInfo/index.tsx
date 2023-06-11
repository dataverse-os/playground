import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useContext, useEffect, useState } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { PostStream } from "@/types";
import {
  FileType,
  MirrorFile,
  StreamContent,
} from "@dataverse/runtime-connector";
import { getDatatokenInfo, postSlice } from "@/state/post/slice";
import Loading from "@/components/BaseComponents/Loading";
import { css } from "styled-components";
import { getCurrencyNameByCurrencyAddress } from "@/sdk";
import { useStream, useWallet } from "@/hooks";
import { Message } from "@arco-design/web-react";
import { identitySlice } from "@/state/identity/slice";
import { noExtensionSlice } from "@/state/noExtension/slice";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
  const pkh = useSelector((state) => state.identity.pkh);
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const isDataverseExtension = useSelector(
    (state) => state.noExtension.isDataverseExtension
  );
  const [datatokenInfo, setDatatokenInfo] = useState({
    sold_num: 0,
    total: "",
    price: {
      amount: "",
      currency: "",
      currency_addr: "",
    },
  });

  const { connectWallet, getCurrentPkh, switchNetwork } = useWallet();

  const { unlockStream, createCapability } = useStream();

  useEffect(() => {
    const postStreamCopy = JSON.parse(JSON.stringify(postStream));
    if (!postStreamCopy.datatokenInfo) {
      return;
    }
    const price = postStreamCopy.datatokenInfo?.collect_info?.price ?? {
      amount: "",
      currency: "",
      currency_addr: "",
    };
    if (!price.currency && price.currency_addr) {
      price.currency = getCurrencyNameByCurrencyAddress(price.currency_addr);
    }
    setDatatokenInfo({
      sold_num: postStreamCopy.datatokenInfo?.collect_info?.sold_num ?? 0,
      total: postStreamCopy.datatokenInfo?.collect_info?.total ?? "",
      price,
    });
  }, [postStream.datatokenInfo]);

  const unlock = async () => {
    if (!isDataverseExtension) {
      dispatch(noExtensionSlice.actions.setModalVisible(true));
      return;
    }
    if (!pkh) {
      try {
        dispatch(identitySlice.actions.setIsConnectingIdentity(true));
        if (!(await getCurrentPkh())) {
          await connectWallet();
        }
        const pkh = await createCapability();
        dispatch(identitySlice.actions.setPkh(pkh));
      } catch (error) {
        console.error(error);
        return;
      } finally {
        dispatch(identitySlice.actions.setIsConnectingIdentity(false));
      }
    }

    if (postStream.isUnlocking || postStream.hasUnlockedSuccessfully) {
      console.log("cannot unlock");
      return;
    }
    // let streamList: PostStream[] = postStreamList;
    try {
      _unlockPending();
      const { streamContent, streamId } = await unlockStream(
        postStream.streamId
      );
      _unlockSucceed(streamContent, streamId);
    } catch (error: any) {
      Message.error(error?.message ?? error);
      _unlockFailed();
    }
  };

  useEffect(() => {
    if (postStream.isGettingDatatokenInfo || postStream.hasGotDatatokenInfo) {
      return;
    }

    if (
      postStream.streamRecord.streamContent.file.fileType === FileType.Datatoken
    ) {
      dispatch(
        getDatatokenInfo({
          address: postStream.streamRecord.streamContent.file.datatokenId!,
        })
      );
    }
  }, [postStreamList.length]);

  useEffect(() => {
    if (postStream.hasUnlockedSuccessfully) {
      setDatatokenInfo({
        ...datatokenInfo,
        sold_num:
          postStream.streamRecord.pkh === pkh
            ? datatokenInfo.sold_num
            : ++datatokenInfo.sold_num,
      });
    }
  }, [postStream.hasUnlockedSuccessfully]);

  const _unlockPending = async () => {
    const streamList = postStreamList.map((post) => {
      if (post.streamId === postStream.streamId) {
        post = {
          ...postStream,
          isUnlocking: true,
        };
      }
      return post;
    });
    dispatch(postSlice.actions.setPostStreamList(streamList));
  };
  const _unlockSucceed = async (
    decryptedStreamContent: StreamContent,
    streamId: string
  ) => {
    const streamList = postStreamList.map((post) => {
      if (post.streamId === streamId) {
        post = {
          ...post,
          streamRecord: {
            ...post.streamRecord,
            streamContent: decryptedStreamContent,
          },
          isUnlocking: false,
          hasUnlockedSuccessfully: true,
        };
      }
      return post;
    });
    dispatch(postSlice.actions.setPostStreamList(streamList));
  };
  const _unlockFailed = async () => {
    const streamList = postStreamList.map((post) => {
      if (post.streamId === postStream.streamId) {
        post = {
          ...postStream,
          isUnlocking: false,
          hasUnlockedSuccessfully: false,
        };
      }
      return post;
    });

    dispatch(postSlice.actions.setPostStreamList(streamList));
  };

  return (
    <Wrapper>
      {postStream.isUnlocking ? (
        <Loading
          visible={postStream.isUnlocking}
          color="black"
          cssStyles={css`
            margin-right: 5px;
            .iconSpinner {
              width: 25px;
            }
          `}
        />
      ) : (
        <img
          src={postStream.hasUnlockedSuccessfully ? unlockSVG : lockSVG}
          className="lock"
          onClick={unlock}
        ></img>
      )}
      {postStream.streamRecord.streamContent.file.fileType ===
        FileType.Datatoken && (
        <DatatokenInfoWrapper>
          <span className="amount">{datatokenInfo.price.amount}</span>
          <span className="currency">{datatokenInfo.price.currency}</span>
          <br />
          <span className="boughtNum">{datatokenInfo.sold_num}</span> /
          <span className="collectLimit">
            {datatokenInfo.total === String(2 ** 52)
              ? " Unlimited"
              : " " + datatokenInfo.total}
          </span>
          <span className="Sold">Sold</span>
        </DatatokenInfoWrapper>
      )}
    </Wrapper>
  );
};

export default UnlockInfo;
