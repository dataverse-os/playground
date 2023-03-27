import { DatatokenVars, ModelNames } from "@dataverse/runtime-connector";
import { appName, client, runtimeConnector } from ".";
import { gql } from "graphql-request";

export const getChainOfDatatoken = async () => {
  const res = await runtimeConnector.getChainOfDatatoken();
  return res;
};

export const createLensProfile = async (handle: string) => {
  const res = await runtimeConnector.createLensProfile(handle);
  return res;
};

export const getLensProfiles = async (address: string) => {
  const res = await runtimeConnector.getLensProfiles(address);
  return res;
};

export const createDatatoken = async (datatokenVars: DatatokenVars) => {
  const res = await runtimeConnector.createDatatoken(datatokenVars);
  return res;
};

export const collect = async (params: {
  did: string;
  datatokenId: string;
  indexFileId: string;
}) => {
  const res = await runtimeConnector.collect({ ...params, appName });
  return res;
};

export const isCollected = async ({
  datatokenId,
  address,
}: {
  datatokenId: string;
  address: string;
}) => {
  const res = await runtimeConnector.isCollected({
    datatokenId,
    address,
  });
  return res;
};

export const getDatatokenInfo = async (variables: { address: string }) => {
  const query = gql`
    query DataToken($address: String!) {
      dataToken(address: $address) {
        address
        collect_info {
          collect_nft_address
          sold_list {
            owner
            token_id
          }
          price {
            amount
            currency
            currency_addr
          }
          sold_num
          total
          who_can_free_collect
        }

        content_uri
        owner
        source
      }
    }
  `;
  const res: any = await client.request(query, { ...variables });
  return res;
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

export const unlock = async (params: { did: string; indexFileId: string }) => {
  console.log({ ...params, appName });
  const res = await runtimeConnector.unlock({ ...params, appName });
  return res;
};
