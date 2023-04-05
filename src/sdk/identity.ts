import {
  checkIsExtensionInjected,
  detectDataverseExtension,
} from "@/utils/checkIsExtensionInjected";
import {
  Apps,
  CRYPTO_WALLET_TYPE,
  METAMASK,
} from "@dataverse/runtime-connector";
import { runtimeConnector, appName, modelNames } from ".";
import { Message } from "@arco-design/web-react";

export const connectWallet = async () => {
  const address = await runtimeConnector.connectWallet({
    name: METAMASK,
    type: CRYPTO_WALLET_TYPE,
  });
  return address;
};

export const getCurrentDID = async () => {
  await detectDataverseExtension();
  const res = await runtimeConnector.getCurrentDID();
  return res;
};

export const checkIsCurrentDIDValid = async () => {
  await detectDataverseExtension();
  const res = await runtimeConnector.checkIsCurrentDIDValid({ appName });
  return res;
};

export const connectIdentity = async () => {
  try {
    await detectDataverseExtension();
    const res = await checkIsCurrentDIDValid();
    await runtimeConnector.connectWallet({
      name: METAMASK,
      type: CRYPTO_WALLET_TYPE,
    });
    if (!res) {
      await runtimeConnector.switchNetwork(137);
      const did = await runtimeConnector.connectIdentity({
        wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
        appName,
      });
      return did;
    }
    const did = await runtimeConnector.getCurrentDID();
    return did;
  } catch (error) {
    console.log(error);
    Message.error("Failed to connect identity");
    throw error;
  }
};

export const createNewDID = async () => {
  const { currentDID, createdDIDList } = await runtimeConnector.createNewDID({
    name: METAMASK,
    type: CRYPTO_WALLET_TYPE,
  });
  return { currentDID, createdDIDList };
};

export const switchDID = async (did: string) => {
  await runtimeConnector.switchDID(did);
};
