import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useEffect } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { CustomMirror, PostStream } from "@/types";
import { FileType } from "@dataverse/runtime-connector";
import { decryptPost, getDatatokenInfo } from "@/state/post/slice";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

  const unlock = () => {
    dispatch(decryptPost({ did, mirrorFile: postStream.mirrorFile }));
  };

  // useEffect(() => {
  //   if (
  //     mirror.mirrorFile.isGettingDatatokenInfo ||
  //     mirror.mirrorFile.hasGotDatatokenInfo ||
  //     (mirror.mirrorFile.isGettingDatatokenInfo === false &&
  //       mirror.mirrorFile.hasGotDatatokenInfo === false)
  //   ) {
  //     return;
  //   }

  //   if (mirror.mirrorFile.fileType === FileType.Datatoken) {
  //     console.log(
  //       mirror.mirrorFile.isGettingDatatokenInfo,
  //       mirror.mirrorFile.hasGotDatatokenInfo
  //     );
  //     dispatch(getDatatokenInfo(mirror.mirrorFile));
  //   }
  //   // getDatatokenInfo();
  // }, [mirror]);
  // console.log(mirror)
  return (
    <Wrapper>
      <img
        src={postStream.isDecryptedSuccessfully ? unlockSVG : lockSVG}
        className="lock"
        onClick={unlock}
      ></img>
      {/* {postStream.streamContent.indexFile.fileType === FileType.Datatoken && (
        <DatatokenInfoWrapper>
          <span className="amount">10</span>
          <span className="currency">WMATIC</span>
          <br />
          <span className="boughtNum">0</span>/
          <span className="collectLimit">100</span>
          <span className="Sold">Sold</span>
        </DatatokenInfoWrapper>
      )} */}
    </Wrapper>
  );
};

export default UnlockInfo;
