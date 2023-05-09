import AccountStatus from "@/components/AccountStatus";
import { addressAbbreviation, getAddressFromDid } from "@/utils/didAndAddress";
import { useAppDispatch, useSelector } from "@/state/hook";
import { PropsWithoutRef, PropsWithRef, useEffect } from "react";
import { FileType } from "@dataverse/runtime-connector";
import { Wrapper, Content, CreatedAt, Footer } from "./styled";
import React from "react";
import { PostStream } from "@/types";
import Text from "./Text";
import Images from "./Images";
import UnlockInfo from "./UnlockInfo";
import { Header } from "./styled";
import { timeAgo } from "@/utils/dateFormat";
import { FlexRow } from "@/components/App/styled";
import { useNavigate } from "react-router-dom";

interface DisplayPostItemProps extends PropsWithRef<any> {
  postStream: PostStream;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Content>
        <Header>
          <FlexRow>
            <AccountStatus
              name={
                addressAbbreviation(
                  getAddressFromDid(postStream.streamContent.controller)
                ) ?? ""
              }
              did={postStream.streamContent.controller}
            />
            <CreatedAt>
              {"• " + timeAgo(Date.parse(postStream.streamContent.createdAt))}
            </CreatedAt>
          </FlexRow>
          {postStream.streamContent.fileType !== FileType.Public && (
            <UnlockInfo postStream={postStream} />
          )}
        </Header>

        <Text
          postStream={postStream}
          onClick={() => {
            navigate("/post/" + postStream.streamId);
          }}
        />
        <Images
          postStream={postStream}
          onClick={() => {
            navigate("/post/" + postStream.streamId);
          }}
        />
        {/* <Footer>
          <a
            href={`${process.env.DATAVERSE_OS}/finder`}
            target="_blank"
            className="link"
          >
            View on DataverseOS File System
          </a>
        </Footer> */}
      </Content>
    </Wrapper>
  );
};

export default DisplayPostItem;
