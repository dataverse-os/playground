import Button from "@/components/Button";
import { useAppDispatch, useSelector } from "@/state/hook";
import { connectIdentity } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import { Brand, HeaderRightRender, Wrapper } from "./styled";

const Header = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

  return (
    <Wrapper>
      <Brand>Playground</Brand>
      <HeaderRightRender>
        <Button
          type="primary"
          onClick={() => {
            dispatch(connectIdentity());
          }}
        >
          {didAbbreviation(did) || "Sign in"}
        </Button>
      </HeaderRightRender>
    </Wrapper>
  );
};

export default Header;
