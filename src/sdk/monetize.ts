import { DatatokenVars, ModelNames } from "@dataverse/runtime-connector";
import { appName, client, runtimeConnector } from ".";
import { gql } from "graphql-request";

export const createDatatoken = async (datatokenVars: DatatokenVars) => {
  const res = await runtimeConnector.createDatatoken(datatokenVars);
  return res;
};

export const collect = async (datatokenId: string) => {
  const res = await runtimeConnector.collect(datatokenId);
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
