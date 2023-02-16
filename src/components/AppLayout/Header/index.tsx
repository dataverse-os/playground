import Button from "@/components/Button";
import { useAppDispatch, useSelector } from "@/state/hook";
import { connectIdentity } from "@/state/identity/slice";
import { didAbbreviation } from "@/utils/didAndAddress";
import { Brand, Wrapper } from "./styled";

const Header = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const did = useSelector((state) => state.identity.did);

  return (
    <Wrapper>
      <Brand>Dataverse</Brand>
      <Button
        onClick={() => {
          dispatch(connectIdentity());
        }}
      >
        {didAbbreviation(did) || "Connect identity"}
      </Button>
    </Wrapper>
  );
};

export default Header;
