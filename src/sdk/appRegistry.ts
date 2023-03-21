import { detectDataverseExtension } from "@/utils/checkIsExtensionInjected";
import { ModelNames } from "@dataverse/runtime-connector";
import { runtimeConnector, appName } from ".";
import { postModelId, indexFileModelId } from "@/sdk";

export const getModelIdByModelName = async (modelName: string) => {
  if (await detectDataverseExtension()) {
    const res = await runtimeConnector.getModelIdByAppNameAndModelName({
      appName,
      modelName,
    });
    return res;
  } else {
    if (modelName === ModelNames.post) {
      return postModelId;
    }
    if (modelName === ModelNames.indexFiles) {
      return indexFileModelId;
    }
  }
};

export const getAppNameAndModelNameByModelId = async (modelId: string) => {
  const res = await runtimeConnector.getAppNameAndModelNameByModelId(modelId);
  return res;
};
