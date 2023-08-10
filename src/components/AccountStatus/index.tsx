import React from "react";

import { FlattenSimpleInterpolation } from "styled-components";

import { Name, Wrapper } from "./styled";
import Avatar from "../Avatar";

interface AccountStatusProps {
  name: string;
  did: string;
  cssStyles?: FlattenSimpleInterpolation;
}

const AccountStatus: React.FC<AccountStatusProps> = ({
  name,
  cssStyles,
  did,
}) => {
  return (
    <Wrapper cssStyles={cssStyles}>
      <Avatar did={did} />
      <Name>{name}</Name>
    </Wrapper>
  );
};

export default AccountStatus;
