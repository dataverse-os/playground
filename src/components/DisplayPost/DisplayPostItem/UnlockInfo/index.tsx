import React from "react";
import { DatatokenInfoWrapper, Wrapper } from "./styled";
import lockSVG from "@/assets/icons/lock.svg";
import unlockSVG from "@/assets/icons/unlock.svg";
import { FileType, StreamRecord } from "@dataverse/dataverse-connector";
import Loading from "@/components/BaseComponents/Loading";
import { css } from "styled-components";
import { getCurrencyNameByCurrencyAddress } from "@/utils";
import { DatatokenInfo } from "@dataverse/hooks";

interface DisplayPostItemProps {
  streamRecord: StreamRecord & { datatokenInfo?: DatatokenInfo };
  isPending: boolean;
  isSucceed: boolean;
  unlock: () => void;
}

const UnlockInfo: React.FC<DisplayPostItemProps> = ({
  streamRecord,
  isPending,
  isSucceed,
  unlock,
}) => {
  return (
    <Wrapper>
      {isPending ? (
        <Loading
          visible={isPending}
          color='black'
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
          className='lock'
          onClick={unlock}
        ></img>
      )}
      {streamRecord.streamContent.file.fileType === FileType.Datatoken && (
        <DatatokenInfoWrapper>
          <span className='amount'>
            {streamRecord.datatokenInfo?.collect_info?.price.amount || 0}
          </span>
          <span className='currency'>
            {streamRecord.datatokenInfo?.collect_info?.price.currency
              ? getCurrencyNameByCurrencyAddress(
                  streamRecord.datatokenInfo?.collect_info?.price.currency,
                )
              : ""}
          </span>
          <br />
          <span className='boughtNum'>
            {streamRecord.datatokenInfo?.collect_info?.sold_num || 0}
          </span>{" "}
          /
          <span className='collectLimit'>
            {streamRecord.datatokenInfo?.collect_info?.total === String(2 ** 52)
              ? " Unlimited"
              : " " + streamRecord.datatokenInfo?.collect_info?.total}
          </span>
          <span className='Sold'>Sold</span>
        </DatatokenInfoWrapper>
      )}
    </Wrapper>
  );
};

export default UnlockInfo;
