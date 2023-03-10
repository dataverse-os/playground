import { useEffect } from "react";
import DisplayFolder from "../DisplayFolder";
import Modal from "../Modal";
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
        </PublishPostWrapper>
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
