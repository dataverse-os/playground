import React, { memo, useEffect, useState } from "react";

import { Img } from "react-image";

import {
  AvatarContainer,
  AvatarContextMenuContainer,
  AvatarImgContainer,
  DefaultAvatarImg,
  Mask,
} from "./styles";
import { getAddressFromDid } from "./utils";

import userIcon from "@/assets/icons/userIcon.svg";
import { usePlaygroundStore } from "@/context";

interface AvatarProps {
  did: string;
  contextMenu?: JSX.Element;
  width?: number;
  height?: number;
}

const contextAvatar = (address?: string) =>
  address ? `https://mint.fun/api/avatar/${address}?size=150` : "";

const Avatar: React.FC<AvatarProps> = ({
  did,
  contextMenu,
  width,
  height,
}: AvatarProps) => {
  const [avatarSrc, setAvatarSrc] = useState<string>(userIcon);
  const [avatar, setAvatar] = useState<string>(userIcon);
  const [open, setOpen] = useState(false);
  // const sortedStreamIds = useSelector((state) => state.post.sortedStreamIds);
  const { sortedStreamIds } = usePlaygroundStore();

  const load = async () => {
    setAvatarSrc(contextAvatar(getAddressFromDid(did)));
  };

  useEffect(() => {
    load();
  }, [did, sortedStreamIds.length]);

  useEffect(() => {
    setAvatar(avatarSrc);
  }, [avatarSrc]);

  return (
    <AvatarContainer
      haveContextMenu={!!contextMenu}
      onClick={() => {
        console.log("click");
        if (contextMenu) {
          setOpen(!open);
        }
      }}
      style={{ width: width, height: height }}
    >
      {avatar ? (
        <Img
          src={avatar}
          loader={<DefaultAvatarImg />}
          unloader={<DefaultAvatarImg />}
          container={children => (
            <AvatarImgContainer>{children}</AvatarImgContainer>
          )}
        />
      ) : (
        <DefaultAvatarImg />
      )}

      {open ? (
        <Mask>
          <AvatarContextMenuContainer visible={open}>
            {contextMenu}
          </AvatarContextMenuContainer>
        </Mask>
      ) : (
        <></>
      )}
    </AvatarContainer>
  );
};

export default memo(Avatar);
