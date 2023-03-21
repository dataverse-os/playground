import React, { useContext, useEffect, useState } from "react";

import Input from "@/components/BaseComponents/Input";
import Modal from "@/components/BaseComponents/Modal";
import createSvg from "@/assets/icons/create.svg";
import Button from "@/components/BaseComponents/Button";
import addSvg from "@/assets/icons/add.svg";
import { Message } from "@arco-design/web-react";
import { buttonStyle, inputStyle, modelWrapper } from "./styled";

const CreateLensProfile = function () {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fileName, setFileName] = useState("");

  // useEffect(() => {
  //   if (!newLensProfileVisible && !uploading && !loading) {
  //     setHandle("");
  //     setFileName("");
  //     setAvatar("");
  //   }
  // }, [uploading, loading, newLensProfileVisible]);

  return (
    <Modal
      controlVisible
      width={512}
      cssStyle={modelWrapper}
      onCancel={() => {}}
    >
      <div className="header">
        <img src={createSvg} className="icon" />
        <div>{"Create Lens profile"}</div>
      </div>
      <div className="title">Handle</div>
      <Input
        value={handle}
        cssStyles={inputStyle}
        placeholder={"username"}
        onChange={(v: string) => setHandle(v)}
      />
      <div className="tip">
        {/* {t('tip: only lowercase letters, numbers and underscores, within 31 bytes')} */}
        Tip: Only supports lower case characters, numbers, must be minimum of 5
        length and maximum of 26 length
      </div>
      <Button
        loading={loading}
        css={buttonStyle}
        type="primary"
        onClick={async () => {
          if (!/^[\da-z]{5,26}$/.test(handle) || handle.length > 26) {
            Message.info(
              "Only supports lower case characters, numbers, must be minimum of 5 length and maximum of 26 length"
            );
            return;
          }
          setLoading(true);
          const obj = {
            handle,
            // profilePictureUri:
            //   avatar || `https://avatar.tobi.sh/${window.address}_${handle}.png`,
          };
          // postMessageRPC?.call(
          //   "createLensProfile",
          //   obj,
          //   async (pagesResponse: PagesResponse) => {
          //     const { code, result, error } = pagesResponse;
          //     if (code === 0) {
          //       // const res = (await getProfiles(window.address)) as LensProfile[];
          //       // console.log(res);
          //       // const current = res.find((el) => {
          //       //   if (el.handle === obj.handle || el.handle === obj.handle + '.test') {
          //       //     return true;
          //       //   }
          //       //   return false;
          //       // });
          //       // console.log(current);
          //       // const profileId = await createProfile();
          //       Message({ content: "Create Lens profile successfully!" });
          //       // setNewLensProfileSuccess(true);

          //       setNewLensProfileVisible(false);
          //       setLoading(false);
          //       states.setCurrentLensProfile({
          //         id: result,
          //         handle: obj.handle + ".test",
          //         checked: true,
          //         // avatar: obj.profilePictureUri,
          //       });
          //       showPublishModal && states.setPublishModalVisible(true);
          //       // states.setSelectLensCollectModuleVisible(true);
          //     } else {
          //       if (error.message === "HANDLE_TAKEN") {
          //         Message({
          //           content: "Name already exists",
          //           type: MessageTypes.Info,
          //         });
          //       } else {
          //         Message({
          //           content: "Failed to create Lens profile!",
          //           type: MessageTypes.Error,
          //         });
          //       }
          //       setLoading(false);
          //     }
          //   }
          // );
        }}
      >
        {"Submit"}
      </Button>
    </Modal>
  );
};

export default CreateLensProfile;
