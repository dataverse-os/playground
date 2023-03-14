import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useEffect } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { PostStream } from "@/types";
import { FileType } from "@dataverse/runtime-connector";
import { decryptPost, getDatatokenInfo } from "@/state/post/slice";
import { connectIdentity } from "@/state/identity/slice";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();

  const unlock = async () => {
    const res = await dispatch(connectIdentity());
    dispatch(decryptPost({ did: res.payload as string, postStream }));
  };

  useEffect(() => {
    if (
      postStream.isGettingDatatokenInfo ||
      postStream.hasGotDatatokenInfo ||
      (postStream.isGettingDatatokenInfo === false &&
        postStream.hasGotDatatokenInfo === false)
    ) {
      return;
    }

    if (postStream.streamContent.fileType === FileType.Datatoken) {
      console.log(
        postStream.isGettingDatatokenInfo,
        postStream.hasGotDatatokenInfo
      );
      dispatch(getDatatokenInfo({ address: postStream.streamId }));
    }
    // getDatatokenInfo();
  }, [postStream]);
  // console.log(postStream)
  return (
    <Wrapper>
      <img
        src={postStream.isDecryptedSuccessfully ? unlockSVG : lockSVG}
        className="lock"
        onClick={unlock}
      ></img>
      {postStream.streamContent.fileType === FileType.Datatoken && (
        <DatatokenInfoWrapper>
          <span className="amount">10</span>
          <span className="currency">WMATIC</span>
          <br />
          <span className="boughtNum">0</span>/
          <span className="collectLimit">100</span>
          <span className="Sold">Sold</span>
        </DatatokenInfoWrapper>
      )}
    </Wrapper>
  );
};

export default UnlockInfo;
