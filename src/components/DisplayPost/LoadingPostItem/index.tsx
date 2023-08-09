import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Wrapper, Content, Header } from "../DisplayPostItem/styled";

export const LoadingPostItem = () => {
  return (
    <Wrapper>
      <Content>
        <Header>
          <Skeleton width={100} count={1} />
        </Header>
        <Skeleton count={5} />
      </Content>
    </Wrapper>
  );
};
