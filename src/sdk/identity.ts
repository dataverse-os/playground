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
  const res = await runtimeConnector.wallet.getCurrentPkh();
  return res;
};

export const checkIsCurrentDIDValid = async () => {
  await detectDataverseExtension();
  const res = await runtimeConnector.checkCapibility(appName);
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
      const did = await runtimeConnector.createCapibility({
        wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
        app: appName,
      });
      return did;
    }
    const did = await runtimeConnector.wallet.getCurrentPkh();
    return did;
  } catch (error) {
    console.log(error);
    Message.error("Failed to connect identity");
    throw error;
  }
};

