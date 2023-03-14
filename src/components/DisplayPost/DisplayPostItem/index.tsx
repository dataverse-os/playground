import AccountStatus from "@/components/AccountStatus";
import { addressAbbreviation, getAddressFromDid } from "@/utils/didAndAddress";
import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { displayMyPosts } from "@/state/folder/slice";
// @ts-ignore
import { FileType } from "@dataverse/runtime-connector";
import { Wrapper, Content } from "./styled";
import React from "react";
import { PostStream } from "@/types";
import Text from "./Text";
import Images from "./Images";
import UnlockInfo from "./UnlockInfo";
import { Header } from "./styled";

interface DisplayPostItemProps {
  postStream: PostStream;
}

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ postStream }) => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);
  return (
    <Wrapper>
      <Content>
        <Header>
          <AccountStatus
            name={
              addressAbbreviation(
                getAddressFromDid(postStream.streamContent.controller)
              ) ?? ""
            }
          />
          {/* {postStream.streamContent.indexFile.createdAt} */}
          {postStream.streamContent.indexFile.fileType !== FileType.Public && (
            <UnlockInfo postStream={postStream} />
          )}
        </Header>
        <Text postStream={postStream} />
        <Images postStream={postStream} />
      </Content>
    </Wrapper>
  );
};

export default DisplayPostItem;
