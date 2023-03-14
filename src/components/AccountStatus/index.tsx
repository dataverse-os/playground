import { useSelector } from "@/state/hook";
import React from "react";
import { FlattenSimpleInterpolation } from "styled-components";
import Avatar from "../Avatar";
import { Name, Wrapper } from "./styled";

export interface AccountStatusProps {
  name: string;
  cssStyles?: FlattenSimpleInterpolation;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ name, cssStyles }) => {
  const did = useSelector((state) => state.identity.did);
  return (
    <Wrapper cssStyles={cssStyles}>
      <Avatar did={did} />
      <Name>{name}</Name>
    </Wrapper>
  );
};

export default AccountStatus;
