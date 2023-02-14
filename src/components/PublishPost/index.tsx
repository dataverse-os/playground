import Button from "../Button";
import Textarea from "../Textarea";
import { Wrapper, ButtonWapper } from "./styled";

export interface PublishPostProps {}

const PublishPost: React.FC<PublishPostProps> = ({}) => {
  return (
    <Wrapper>
      <Textarea height={250}/>
      <ButtonWapper>
        <Button>Post</Button>
      </ButtonWapper>
    </Wrapper>
  );
};

export default PublishPost;
