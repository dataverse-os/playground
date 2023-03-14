import { useSelector } from "@/state/hook";
import React from "react";
import {
  CollectLimit,
  Currency,
  DatatokenInfoWrapper,
  LockImg,
  Price,
  Wrapper,
} from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";

const UnlockInfo: React.FC = () => {
  const did = useSelector((state) => state.identity.did);
  return (
    <Wrapper>
      <LockImg src={lockSVG}></LockImg>
      <DatatokenInfoWrapper>
        <Price></Price>
        <Currency></Currency>
        0/<CollectLimit></CollectLimit>
        Sold
      </DatatokenInfoWrapper>
    </Wrapper>
  );
};

export default UnlockInfo;
