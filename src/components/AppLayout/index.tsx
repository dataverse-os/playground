import { useEffect } from "react";
import DisplayFolder from "../DisplayFolder";
import DisplayPost from "../DisplayPost";
import NoExtensionTip from "../NoExtensionTip";
import PublishPost from "../PublishPost";
import Header from "./Header";
import {
  Container,
  HeaderWrapper,
  BodyWrapper,
  PostWrapper,
  DisplayPostWrapper,
} from "./styled";

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
        <NoExtensionTip />
        {/* <DisplayPostWrapper>
          <DisplayFolder />
        </DisplayPostWrapper> */}
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
