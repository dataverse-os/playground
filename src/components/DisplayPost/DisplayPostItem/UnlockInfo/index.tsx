import { useAppDispatch, useSelector } from "@/state/hook";
import React, { useContext, useEffect, useState } from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { DatatokenInfo, StreamContent } from "@/types";
import {
  FileType,
  MirrorFile,
  StreamRecord,
  // StreamContent,
} from "@dataverse/dataverse-connector";
import { getDatatokenInfo, postSlice } from "@/state/post/slice";
import Loading from "@/components/BaseComponents/Loading";
import { css } from "styled-components";
import { getCurrencyNameByCurrencyAddress } from "@/sdk";
import { Message } from "@arco-design/web-react";
import { noExtensionSlice } from "@/state/noExtension/slice";
import { useApp, useStore, useUnlockStream } from "@dataverse/hooks";
import { Context } from "@/context";

interface DisplayPostItemProps {
  streamRecord: StreamRecord;
  isPending: boolean;
  isSucceed: boolean;
  datatokenInfo?: DatatokenInfo;
  unlock: () => void;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({
  streamRecord,
  isPending,
  isSucceed,
  datatokenInfo,
  unlock,
}) => {

  return (
    <Wrapper>
      {isPending ? (
        <Loading
          visible={isPending}
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
          src={isSucceed ? unlockSVG : lockSVG}
          className="lock"
          onClick={unlock}
        ></img>
      )}
      {streamRecord.streamContent.file.fileType === FileType.Datatoken && (
        <DatatokenInfoWrapper>
          <span className="amount">
            {datatokenInfo?.collect_info?.price.amount || 0}
          </span>
          <span className="currency">
            {datatokenInfo?.collect_info?.price.currency
              ? getCurrencyNameByCurrencyAddress(
                  datatokenInfo?.collect_info?.price.currency
                )
              : ""}
          </span>
          <br />
          <span className="boughtNum">
            {datatokenInfo?.collect_info?.sold_num || 0}
          </span>{" "}
          /
          <span className="collectLimit">
            {datatokenInfo?.collect_info?.total === String(2 ** 52)
              ? " Unlimited"
              : " " + datatokenInfo?.collect_info?.total}
          </span>
          <span className="Sold">Sold</span>
        </DatatokenInfoWrapper>
      )}
    </Wrapper>
  );
};

export default UnlockInfo;
