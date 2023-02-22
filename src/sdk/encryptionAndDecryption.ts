import { LitKit } from "@/types";
import { DecryptionConditionsTypes } from "@dataverse/runtime-connector";
import { runtimeConnector, appName, modelNames } from ".";

export const newLitKey = async ({
  did,
  decryptionConditions,
  decryptionConditionsType,
}: {
  did: string;
  decryptionConditions: any[];
  decryptionConditionsType: DecryptionConditionsTypes;
}) => {
  const { encryptedSymmetricKey } = await runtimeConnector.newLitKey({
    did,
    appName,
    modelNames,
    decryptionConditions,
    decryptionConditionsType,
  });

  return {
    encryptedSymmetricKey,
    decryptionConditions,
    decryptionConditionsType,
  };
};

export const encryptWithLit = async ({
  did,
  contentToBeEncrypted,
  litKit,
}: {
  did: string;
  contentToBeEncrypted: string;
  litKit: LitKit;
}) => {
  const { encryptedContent } = await runtimeConnector.encryptWithLit({
    did,
    appName,
    modelNames,
    content: contentToBeEncrypted,
    ...litKit,
  });

  return { encryptedContent, litKit };
};

export const decryptWithLit = async ({
  did,
  encryptedContent,
  encryptedSymmetricKey,
  decryptionConditions,
  decryptionConditionsType,
  symmetricKeyInBase16Format,
}: {
  did: string;
  encryptedContent: string;
  encryptedSymmetricKey?: string;
  decryptionConditions?: any[];
  decryptionConditionsType?: DecryptionConditionsTypes;
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
          decryptionConditions,
          decryptionConditionsType,
        }),
  });
  return content;
};
