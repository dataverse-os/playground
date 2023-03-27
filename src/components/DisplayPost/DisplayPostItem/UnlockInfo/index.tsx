import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useEffect, useState } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { PostStream } from "@/types";
import { FileType } from "@dataverse/runtime-connector";
import { buyPost, decryptPost, getDatatokenInfo } from "@/state/post/slice";
import { connectIdentity } from "@/state/identity/slice";
import Loading from "@/components/BaseComponents/Loading";
import { css } from "styled-components";
import { uuid } from "@/utils/uuid";
import { getCurrencyNameByCurrencyAddress } from "@/sdk/monetize";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
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
    const res = await dispatch(connectIdentity());
    const did = res.payload as string;
    if (postStream.streamContent.content.controller === did) {
      if (postStream.isDecrypting || postStream.isDecryptedSuccessfully) {
        return;
      }
      dispatch(decryptPost({ did, postStream }));
    } else {
      if (postStream.isBuying || postStream.hasBoughtSuccessfully) {
        return;
      }
      await dispatch(buyPost({ did, postStream }));
      // dispatch(getDatatokenInfo({ address: postStream.streamContent.datatokenId! }));
    }
  };

  useEffect(() => {
    if (postStream.isGettingDatatokenInfo || postStream.hasGotDatatokenInfo) {
      return;
    }

    if (postStream.streamContent.fileType === FileType.Datatoken) {
      console.log(
        postStream.isGettingDatatokenInfo,
        postStream.hasGotDatatokenInfo
      );
      dispatch(
        getDatatokenInfo({ address: postStream.streamContent.datatokenId! })
      );
    }
  }, [postStreamList.length]);

  return (
    <Wrapper>
      {postStream.isDecrypting || postStream.isBuying ? (
        <Loading
          visible={postStream.isDecrypting || postStream.isBuying}
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
          src={
            postStream.isDecryptedSuccessfully ||
            postStream.hasBoughtSuccessfully
              ? unlockSVG
              : lockSVG
          }
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
