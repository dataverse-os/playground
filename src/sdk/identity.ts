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

export const chooseWallet = async () => {
  const wallet = await runtimeConnector.chooseWallet();
  return wallet;
};

export const connectWallet = async (wallet: CRYPTO_WALLET) => {
  const address = await runtimeConnector.connectWallet(wallet);
  return address;
};

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
  const res = await runtimeConnector.checkIsCurrentDIDValid({ appName });
  return res;
};

export const connectIdentity = async () => {
  try {
    await detectDataverseExtension();

    const currentDID = await runtimeConnector.getCurrentDID();
    let chainId;
    try {
      const { reference } = getNamespaceAndReferenceFromDID(currentDID);
      chainId = Number(reference);
    } catch (error) {}

    const currentWallet = await getCurrentWallet();
    if (!currentWallet) {
      const wallet = await chooseWallet();
      await connectWallet(wallet);
    }

    const res = await checkIsCurrentDIDValid();
    if (!res) {
      await switchNetwork(chainId || 137);
      const did = await runtimeConnector.connectIdentity({
        appName,
      });
      return did;
    }
    return currentDID;
  } catch (error) {
    console.log(error);
    Message.error("Failed to connect identity");
    throw error;
  }
};

export const getCurrentDID = async () => {
  const res = await runtimeConnector.getCurrentDID();
  return res;
};

export const getWalletByDID = async (did: string) => {
  return runtimeConnector.getWalletByDID(did);
};

export const createNewDID = async (wallet: CRYPTO_WALLET) => {
  const { currentDID, createdDIDList } = await runtimeConnector.createNewDID(
    wallet
  );
  return { currentDID, createdDIDList };
};

export const switchDID = async (did: string) => {
  await runtimeConnector.switchDID(did);
};
