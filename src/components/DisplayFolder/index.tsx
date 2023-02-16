import { useAppDispatch, useSelector } from "@/state/hook";
import { useEffect } from "react";
import { Wrapper, PostWapper } from "./styled";
import { displayDefaultFolder } from "@/state/folder/slice";
import { appName } from "@/sdk";
import { ModelNames } from "@dataverse/runtime-connector";

export interface PublishPostProps {}

const DisplayPostInFolder: React.FC<PublishPostProps> = ({}) => {
  const folder = useSelector((state) => state.folder.folder);
  const did = useSelector((state) => state.identity.did);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(displayDefaultFolder(did));
  }, [did]);

  return (
    <Wrapper>
      {folder &&
        folder.mirrors.map((mirror, index) => (
          <PostWapper key={mirror.mirrorId} marginTop={index === 0 ? 0 : 24}>
            {mirror.mirrorFile.appName === appName &&
            mirror.mirrorFile.modelName === ModelNames.post
              ? mirror.mirrorFile.content.content
              : mirror.mirrorFile.contentId}
          </PostWapper>
        ))}
    </Wrapper>
  );
};

export default DisplayPostInFolder;
