import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useEffect, useState } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { PostStream } from "@/types";
import { FileType } from "@dataverse/runtime-connector";
import { getDatatokenInfo, postSlice } from "@/state/post/slice";
// import { connectIdentity } from "@/state/identity/slice";
import Loading from "@/components/BaseComponents/Loading";
import { css } from "styled-components";
import { uuid } from "@/utils/uuid";
import { getCurrencyNameByCurrencyAddress } from "@/sdk/monetize";
import { useModel, useStream } from "@/hooks";
import { appName } from "@/sdk";
import { Message } from "@arco-design/web-react";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.pkh);
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const [datatokenInfo, setDatatokenInfo] = useState({
    sold_num: 0,
    total: "",
    price: {
      amount: "",
      currency: "",
      currency_addr: "",
    },
  });
  
  const {
    unlockStream
  } = useStream(appName);

  const {
    postModel
  } = useModel();

  useEffect(() => {
    const postStreamCopy = JSON.parse(JSON.stringify(postStream));
    if (!postStreamCopy.streamContent.datatokenInfo) {
      return;
    }
    const price = postStreamCopy.streamContent.datatokenInfo?.collect_info
      ?.price ?? {
      amount: "",
      currency: "",
      currency_addr: "",
    };
    if (!price.currency && price.currency_addr) {
      price.currency = getCurrencyNameByCurrencyAddress(price.currency_addr);
    }
    setDatatokenInfo({
      sold_num:
        postStreamCopy.streamContent.datatokenInfo?.collect_info?.sold_num ?? 0,
      total:
        postStreamCopy.streamContent.datatokenInfo?.collect_info?.total ?? "",
      price,
    });
  }, [postStream.streamContent.datatokenInfo]);

  const unlock = async () => {
    // const { payload: did } = await dispatch(connectIdentity());
    if (postStream.isUnlocking || postStream.hasUnlockedSuccessfully) {
      console.log("cannot unlock")
      return;
    }
    // await dispatch(unlockPost({ postStream }));
    console.log("postStream:", postStream)
    let streamList: PostStream[] = postStreamList;
    console.log("streamList before:", streamList)
    try {
      _unlockPending();
      const res = await unlockStream(postStream.streamId);
      console.log("after unlockStream, res:", res)
      _unlockSucceed();
    } catch (error: any) {
      Message.error((error?.message ?? error));
      _unlockFailed();
    }
  };

  useEffect(() => {
    if (postStream.isGettingDatatokenInfo || postStream.hasGotDatatokenInfo) {
      return;
    }

    if (postStream.streamContent.fileType === FileType.Datatoken) {
      dispatch(
        getDatatokenInfo({ address: postStream.streamContent.datatokenId! })
      );
    }
  }, [postStreamList.length]);

  useEffect(() => {
    if (postStream.hasUnlockedSuccessfully) {
      setDatatokenInfo({
        ...datatokenInfo,
        sold_num: postStream.streamContent.controller === did ? datatokenInfo.sold_num : ++datatokenInfo.sold_num,
      });
    }
  }, [postStream.hasUnlockedSuccessfully]);

  const _unlockPending = async () => {
    // streamList.find((post) => {
    //   if (post.streamId === postStream.streamId) {
    //     post = {
    //       ...postStream,
    //       isUnlocking: true,
    //     };
    //     console.log("unlock pending, post:", post)
    //   }
    // });

    const streamList = postStreamList.map((post) => {
      if (post.streamId === postStream.streamId) {
        post = {
          ...postStream,
          isUnlocking: true,
        };
        console.log("unlock pending, post:", post)
      } 
      return post
    })

    dispatch(postSlice.actions.setPostStreamList(streamList));
  }
  const _unlockSucceed = async () => {
    // streamList.find((post, index) => {
    //   if (post.streamId === postStream.streamId) {
    //     console.log("unlock success(before), post:", post)
    //     console.log("index:", index)
    //     post = {
    //       ...postStream,
    //       isUnlocking: false,
    //       hasUnlockedSuccessfully: true,
    //     };
    //     console.log("unlock success(after), post:", post)
    //     // post = Object.assign(post, {
    //       //   ...postStream,
    //       //   isUnlocking: false,
    //       //   hasUnlockedSuccessfully: true,
    //       // });
    //     }
    //   });
    const streamList = postStreamList.map((post) => {
      if (post.streamId === postStream.streamId) {
        post = {
          ...postStream,
          isUnlocking: false,
          hasUnlockedSuccessfully: true,
        };
        console.log("unlock pending, post:", post)
      } 
      return post
    })
      
    console.log("unlock success(after), streamList:", streamList)
    dispatch(postSlice.actions.setPostStreamList(streamList));
  }
  const _unlockFailed = async () => {
    const streamList = postStreamList.map((post) => {
      if (post.streamId === postStream.streamId) {
        post = {
          ...postStream,
          isUnlocking: false,
          hasUnlockedSuccessfully: false,
        };
      }
      return post
    });

    dispatch(postSlice.actions.setPostStreamList(streamList));
  }

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
      {postStream.streamContent.fileType === FileType.Datatoken && (
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
