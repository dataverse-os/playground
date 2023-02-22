import {
  DecryptionConditionsTypes,
  Mirror,
  MirrorFile,
  StructuredFolder,
} from "@dataverse/runtime-connector";

export interface CustomMirrorFile extends MirrorFile {
  appName?: string;
  modelName?: string;
  isDecrypting?: boolean;
  isDecryptedSuccessfully?: boolean;
  isMonetizing?: boolean;
  isMonetizedSuccessfully?: boolean;
  isBuying?: boolean;
  isBoughtSuccessfully?: boolean;
}
export type CustomMirror = Omit<Mirror, "mirrorFile"> & {
  mirrorFile: CustomMirrorFile;
};

export type CustomFolder = Omit<StructuredFolder, "mirrors"> & {
  mirrors: CustomMirror[];
};

export interface LitKit {
  encryptedSymmetricKey: string;
  decryptionConditions: any[];
  decryptionConditionsType: DecryptionConditionsTypes;
}
