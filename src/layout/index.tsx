import DisplayPost from "../components/DisplayPost";
import Header from "./Header";
import { Container, HeaderWrapper, BodyWrapper, PostWrapper } from "./styled";

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
