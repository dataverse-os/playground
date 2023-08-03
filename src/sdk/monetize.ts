import { DataverseConnector } from "@dataverse/dataverse-connector";

const dataverseConnector = new DataverseConnector();

export const createLensProfile = async (handle: string) => {
  const res = await dataverseConnector.createProfile(handle);
  return res;
};

export const getDatatokenInfo = async (address: string) => {
  const datatokenInfo = await dataverseConnector.getDatatokenBaseInfo(address);
  return datatokenInfo;
};

export const getCurrencyNameByCurrencyAddress = (currencyAddress: string) => {
  const map: Record<string, string> = {
    "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e": "USDC",
    "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F": "DAI",
    "0x3C68CE8504087f89c640D02d133646d98e64ddd9": "WETH",
    "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889": "WMATIC",
  };
  return map[currencyAddress];
};
