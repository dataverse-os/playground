import React from 'react';
import AccountStatus from "../AccountStatus";
import { Content, Wrapper } from "../PublishPost/styled";
import { DisplayPostItemProps } from "./types";
import { didAbbreviation } from "@/utils/didAndAddress";

const DisplayPostItem: React.FC<DisplayPostItemProps> = ({ stream }) => {
  return (
    <Wrapper>
      <Content>
        <AccountStatus name={didAbbreviation(stream.streamId)} avatar={""} />
      </Content>
    </Wrapper>
  )
}

export default DisplayPostItem
