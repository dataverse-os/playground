import { METAMASK, CRYPTO_WALLET_TYPE } from "@dataverse/dataverse-kernel";
import { runtimeConnector, appName, modelNames } from ".";

export const connectWallet = async () => {
  const address = await runtimeConnector.connectWallet({
    name: METAMASK,
    type: CRYPTO_WALLET_TYPE,
  });
  console.log(address);
  return address;
};

export const connectIdentity = async () => {
  const did = await runtimeConnector.connectIdentity({
    wallet: { name: METAMASK, type: CRYPTO_WALLET_TYPE },
    appName,
    modelNames,
  });
  console.log(did);
  return did;
};

export const createNewDID = async () => {
  const { currentDid, createdDidList } = await runtimeConnector.createNewDID({
    name: METAMASK,
    type: CRYPTO_WALLET_TYPE,
  });
  console.log({ currentDid, createdDidList });
  return { currentDid, createdDidList };
};

export const switchDID = async (did: string) => {
  await runtimeConnector.switchDID(did);
};
