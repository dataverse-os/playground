import React from "react";

import Header from "./Header";
import { Container, HeaderWrapper, BodyWrapper, PostWrapper } from "./styled";
import DisplayPost from "../components/DisplayPost";

const Layout: React.FC = (): React.ReactElement => {
  return (
    <Container>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <PostWrapper>
          <DisplayPost />
        </PostWrapper>
        {/* <NoExtensionTip /> */}
        {/* <DisplayPostWrapper>
          <DisplayFolder />
        </DisplayPostWrapper> */}
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
