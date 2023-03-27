import React, { memo, useContext, useEffect, useState } from "react";
import { getAddressFromDid, getDidFromAddress, proxy } from "./utils";
import userIcon from "@/assets/icons/userIcon.svg";
import {
  AvatarContainer,
  AvatarContextMenuContainer,
  AvatarImg,
  DefaultAvatarImg,
} from "./styles";
import { checkImgExists } from "./utils";
import styled from "styled-components";
import { BasicProfile } from "./types";
import { useSelector } from "@/state/hook";

export const getProfile = async (profileId: string) => {
  return {};
};

export type DisplayInWhere = "header" | "content" | "contextMenu";

export interface AvatarProps {
  did: string;
  address?: string;
  handleProfile?: Function;
  contextMenu?: JSX.Element;
  setBackgroundLoading?: Function;
  width?: number;
  height?: number;
}

export interface Original {
  src: string;
  mimeType: string;
  width: number;
  height: number;
}

const baseUrl = process.env.IPFS_WEB3STORAGE!;
const ipfsNull = "ipfs://null";
const defaultOriginal: Original = {
  src: ipfsNull,
  mimeType: "",
  width: 1,
  height: 1,
};
const contextAvatar = (address?: string) =>
  address ? `https://context.app/api/avatar/${address}?size=150` : "";

const emptyProfile = {
  name: "",
  description: "",
  image: {
    original: defaultOriginal,
  },
  background: {
    original: defaultOriginal,
  },
};

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: grey; */
  /* opacity: 0.4; */
  /* z-index: 999; */
`;

const Avatar: React.FC<AvatarProps> = ({
  did,
  address,
  handleProfile,
  contextMenu,
  setBackgroundLoading,
  width,
  height,
}) => {
  const [originalBackground, setBackground] = useState(
    JSON.parse(JSON.stringify(defaultOriginal))
  );
  const [originalImage, setImage] = useState(
    JSON.parse(JSON.stringify(defaultOriginal))
  );
  const [avatarSrc, setAvatarSrc] = useState<string>(userIcon);
  const [imageLoading, setImageLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(userIcon);
  const [name, setName] = useState<string>();
  const [open, setOpen] = useState(false);
  const [bg, setBg] = useState("");
  const postStreamList = useSelector((state) => state.post.postStreamList);
  async function load() {
    if (imageLoading) return;
    setBackgroundLoading?.(true);
    setImageLoading(true);
    if (did && !address) {
      address = getAddressFromDid(did);
    }
    emptyProfile.image.original.src = contextAvatar(address);
    try {
      const profileId = did || getDidFromAddress(address!);
      if (!profileId) {
        setBackgroundLoading?.(false);
        setImageLoading(false);
        setAvatarSrc(contextAvatar(address));
        setName("");
        handleProfile?.();
        return;
      }
      const profile = (await getProfile(profileId)) as BasicProfile;
      if (profile && Object.keys(profile).length > 0) {
        setBackground(profile.background.original);
        setImage(profile.image.original);
        setName(profile.name || "");
        if (
          profile.background.original.src === ipfsNull ||
          profile.background.original.src === "ipfs/bafy..." ||
          profile.background.original.src === "ipfs://bafy..."
        ) {
          setBg("");
        } else {
          const url = proxy(
            profile.background.original.src.replace("ipfs://", baseUrl)
          );
          fetch(url)
            .then((res) => res.text())
            .then((res) => {
              if (res.includes("base64")) {
                setBg(res);
              } else {
                setBg(url);
              }
            });
        }
        if (
          profile.image.original.src === ipfsNull ||
          profile.image.original.src === "ipfs:/bafy..." ||
          profile.image.original.src === "ipfs://bafy..."
        ) {
          setAvatarSrc(contextAvatar(address));
        } else {
          const url = proxy(
            profile.image.original.src.replace("ipfs://", baseUrl)
          );
          fetch(url)
            .then((res) => res.text())
            .then((res) => {
              if (res.includes("base64")) {
                setAvatarSrc(res);
              } else {
                setAvatarSrc(url);
              }
            });
        }
      } else {
        setName("");
        setAvatarSrc(contextAvatar(address));
      }
      handleProfile?.({ ...profile, did: profileId });
      setBackgroundLoading?.(false);
      setImageLoading(false);
    } catch {
      setBackgroundLoading?.(false);
      setImageLoading(false);
      setAvatarSrc(contextAvatar(address));
      setName("");
      handleProfile?.();
    }
  }

  // useEffect(() => {
  //   return () => console.log("avatar destroy...");
  // }, []);

  useEffect(() => {
    if (!did) return;
    load();
  }, [did, postStreamList.length]);


  useEffect(() => {
    checkImgExists(avatarSrc).then(() => {
      setAvatar(avatarSrc);
    });
  }, [avatarSrc]);

  return (
    <AvatarContainer
      haveContextMenu={!!contextMenu}
      onClick={() => {
        console.log("click");
        if (contextMenu) {
          setOpen(!open);
          // dispatch(uiSlice.actions.setSettingsModalVisible(!settingsModalVisible));
        }
      }}
      style={{ width: width, height: height }}
    >
      {avatar ? <AvatarImg src={avatar} /> : <DefaultAvatarImg />}

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
