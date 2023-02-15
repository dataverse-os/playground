import {
  DecryptionConditionsTypes,
  ModelNames,
} from "@dataverse/dataverse-kernel";
import { runtimeConnector, appName, modelNames } from ".";

export const generateAccessControlConditions = async ({
  did,
  address,
}: {
  did: string;
  address: string;
}) => {
  const modelId = await runtimeConnector.getModelIdByAppNameAndModelName({
    appName,
    modelName: ModelNames.post,
  });
  const chain = await runtimeConnector.getChainFromLitAuthSig({
    did,
    appName,
    modelNames,
  });
  const conditions: any[] = [
    {
      contractAddress: "",
      standardContractType: "",
      chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: `${address}`,
      },
    },
    { operator: "and" },
    {
      contractAddress: "",
      standardContractType: "SIWE",
      chain,
      method: "",
      parameters: [":resources"],
      returnValueTest: {
        comparator: "contains",
        value: `ceramic://*?model=${modelId}`,
      },
    },
  ];

  return conditions;
};

export const newLitKey = async ({
  did,
  address,
}: {
  did: string;
  address: string;
}) => {
  const decryptionConditions = await generateAccessControlConditions({
    did,
    address,
  });
  const decryptionConditionsType =
    DecryptionConditionsTypes.AccessControlCondition;

  const { encryptedSymmetricKey } = await runtimeConnector.newLitKey({
    did,
    appName,
    modelNames,
    decryptionConditions,
    decryptionConditionsType,
  });
  console.log(encryptedSymmetricKey);

  return {
    encryptedSymmetricKey,
    decryptionConditions,
    decryptionConditionsType,
  };
};

export const encryptWithLit = async ({
  did,
  content,
  encryptedSymmetricKey,
  decryptionConditions,
  decryptionConditionsType,
}: {
  did: string;
  content: string;
  encryptedSymmetricKey: string;
  decryptionConditions: any[];
  decryptionConditionsType: DecryptionConditionsTypes;
}) => {
  const { encryptedContent } = await runtimeConnector.encryptWithLit({
    did,
    appName,
    modelNames,
    content,
    encryptedSymmetricKey,
    decryptionConditions,
    decryptionConditionsType,
  });
  console.log(encryptedContent);

  return encryptedContent;
};

export const decryptWithLit = async ({
  did,
  address,
  encryptedContent,
  encryptedSymmetricKey,
  symmetricKeyInBase16Format,
}: {
  did: string;
  address: string;
  encryptedContent: string;
  encryptedSymmetricKey?: string;
  symmetricKeyInBase16Format?: string;
}) => {
  const { content } = await runtimeConnector.decryptWithLit({
    did,
    appName,
    modelNames,
    encryptedContent,
    ...(symmetricKeyInBase16Format
      ? { symmetricKeyInBase16Format }
      : {
          encryptedSymmetricKey,
          decryptionConditions: await generateAccessControlConditions({
            did,
            address,
          }),
          decryptionConditionsType:
            DecryptionConditionsTypes.AccessControlCondition,
        }),
  });
  console.log(content);
  return content;
};
