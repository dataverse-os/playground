import { useSelector } from "@/state/hook";
import React from "react";
import Avatar from "../Avatar";
import { Name, Wrapper } from "./styled";
import { AccountStatusProps } from "./types";

const AccountStatus: React.FC<AccountStatusProps> = ({ name, avatar }) => {
  const did = useSelector((state) => state.identity.did);
  return (
    <Wrapper>
      <Avatar did={did} />
      <Name>{name}</Name>
    </Wrapper>
  );
};

export default AccountStatus;
