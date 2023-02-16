import { runtimeConnector, appName } from ".";

export const getModelIdByAppNameAndModelName = async (modelName: string) => {
  const res = await runtimeConnector.getModelIdByAppNameAndModelName({
    appName,
    modelName,
  });
  return res;
};

export const getAppNameAndModelNameByModelId = async (modelId: string) => {
  const res = await runtimeConnector.getAppNameAndModelNameByModelId(modelId);
  return res;
};
