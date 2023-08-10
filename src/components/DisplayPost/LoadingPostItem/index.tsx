import React from "react";

import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";
import { Wrapper, Content, Header } from "../DisplayPostItem/styled";

const LoadingPostItem = () => {
  return (
    <Wrapper>
      <Content>
        <Header>
          <Skeleton width={150} count={1} />
        </Header>
        <Skeleton count={7} />
      </Content>
    </Wrapper>
  );
};

export default LoadingPostItem;
