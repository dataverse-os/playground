import { useEffect } from "react";
import DisplayFolder from "../DisplayFolder";
import DisplayPost from "../DisplayPost";
import PublishPost from "../PublishPost";
import Header from "./Header";
import {
  Container,
  HeaderWrapper,
  BodyWrapper,
  PublishPostWrapper,
  DisplayPostWrapper,
} from "./styled";

const Layout: React.FC = (): React.ReactElement => {
  return (
    <Container>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <PublishPostWrapper>
          <PublishPost />
          
          <DisplayPost />
        </PublishPostWrapper>
        {/* <DisplayPostWrapper>
          <DisplayFolder />
        </DisplayPostWrapper> */}
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
