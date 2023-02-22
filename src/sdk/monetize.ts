import { DatatokenVars, ModelNames } from "@dataverse/runtime-connector";
import { appName, runtimeConnector } from ".";

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
