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

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
  const postStreamList = useSelector((state) => state.post.postStreamList);
  const [total, setTotal] = useState("");
  const [soldSum, setSoldSum] = useState(0);

  useEffect(() => {
    if (postStream.streamContent.datatokenInfo?.collect_info.sold_num) {
      setSoldSum(postStream.streamContent.datatokenInfo?.collect_info.sold_num)
    }
  }, [postStream.streamContent.datatokenInfo?.collect_info.sold_num])

  useEffect(() => {
    if (postStream.streamContent.datatokenInfo?.collect_info.total) {
      setTotal(postStream.streamContent.datatokenInfo?.collect_info.total)
    }
  }, [postStream.streamContent.datatokenInfo?.collect_info.total])

  const unlock = async () => {
    const res = await dispatch(connectIdentity());
    const did = res.payload as string;
    if (postStream.streamContent.content.controller === did) {
      dispatch(decryptPost({ did, postStream }));
    } else {
      dispatch(buyPost({ did, postStream }));
    }
  };

  useEffect(() => {
    if (
      postStream.isGettingDatatokenInfo ||
      postStream.hasGotDatatokenInfo
    ) {
      return;
    }

    if (postStream.streamContent.fileType === FileType.Datatoken) {
      console.log(
        postStream.isGettingDatatokenInfo,
        postStream.hasGotDatatokenInfo
      );
      dispatch(getDatatokenInfo({ address: postStream.streamContent.datatokenId! }));
    }
  }, [postStreamList.length]);

  return (
    <Wrapper>
      {
        postStream.isDecrypting || postStream.isBuying ? (
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
        )
      }
      {
        postStream.streamContent.fileType === FileType.Datatoken && (
          <DatatokenInfoWrapper>
            {/* <span className="amount">10</span>
            <span className="currency">WMATIC</span>
            <br /> */}
            <span className="boughtNum">{soldSum}</span> /
            <span className="collectLimit">{total === '0' ? ' unlimited' : ' ' + total}</span>
            <span className="Sold">Sold</span>
          </DatatokenInfoWrapper>
        )
      }
    </Wrapper>
  );
};

export default UnlockInfo;
