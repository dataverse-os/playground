import { CRYPTO_WALLET_TYPE, METAMASK } from "@dataverse/runtime-connector";
import { runtimeConnector, appName, modelNames } from ".";

export const connectWallet = async () => {
  const address = await runtimeConnector.connectWallet({
    name: METAMASK,
    type: CRYPTO_WALLET_TYPE,
  });
  return address;
};

export const connectIdentity = async () => {
  const did = await runtimeConnector.connectIdentity({
    wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
    appName,
    modelNames,
  });
  return did;
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
