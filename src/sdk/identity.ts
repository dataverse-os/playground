import {
  checkIsExtensionInjected,
  detectDataverseExtension,
} from "@/utils/checkIsExtensionInjected";
import {
  Apps,
  CRYPTO_WALLET,
  CRYPTO_WALLET_TYPE,
  METAMASK,
} from "@dataverse/runtime-connector";
import { runtimeConnector, appName, modelNames } from ".";
import { Message } from "@arco-design/web-react";
import { getNamespaceAndReferenceFromDID } from "@/utils/didAndAddress";

export const connectWallet = async (wallet: CRYPTO_WALLET) => {
  const address = await runtimeConnector.connectWallet(wallet);
  return address;
};

export const getCurrentDID = async () => {
  await detectDataverseExtension();
  const res = await runtimeConnector.wallet.getCurrentPkh();
  return res;
}

export const getCurrentWallet = async () => {
  const res = await runtimeConnector.getCurrentWallet();
  return res;
};

export const switchNetwork = async (chainId: number) => {
  const res = await runtimeConnector.switchNetwork(chainId);
  return res;
};

export const checkIsCurrentDIDValid = async () => {
  await detectDataverseExtension();
  const res = await runtimeConnector.checkCapability(appName);
  return res;
};

export const connectIdentity = async () => {
  try {
    await detectDataverseExtension();

    const currentDID = await runtimeConnector.wallet.getCurrentPkh();
    let chainId;
    try {
      const { reference } = getNamespaceAndReferenceFromDID(currentDID);
      chainId = Number(reference);
    } catch (error) {}

    const currentWallet = await getCurrentWallet();
    if (!currentWallet) {
      const wallet = await runtimeConnector.selectWallet();
      await connectWallet(wallet);
    }

    const res = await checkIsCurrentDIDValid();
    if (!res) {
      await switchNetwork(chainId || 137);
      const did = await runtimeConnector.createCapability({
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

