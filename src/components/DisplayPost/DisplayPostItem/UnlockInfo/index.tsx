import { useAppDispatch, useSelector } from "@/state/hook";
import React from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { CustomMirror } from "@/types";
import { FileType } from "@dataverse/runtime-connector";
import { decryptPost } from "@/state/post/slice";

interface DisplayPostItemProps {
  mirror: CustomMirror;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({ mirror }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

  const unlock = () => {
    dispatch(decryptPost({ did, mirrorFile: mirror.mirrorFile }));
  };

  return (
    <Wrapper>
      <img
        src={mirror.mirrorFile.isDecryptedSuccessfully ? unlockSVG : lockSVG}
        className="lock"
        onClick={unlock}
      ></img>
      {mirror.mirrorFile.fileType === FileType.Datatoken && (
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
