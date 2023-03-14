import {
  DecryptionConditionsTypes,
  IndexFileContentType,
  Mirror,
  MirrorFile,
  StructuredFolder,
} from "@dataverse/runtime-connector";

export interface CustomMirrorFile extends MirrorFile {
  contentType: IndexFileContentType | string;
  appName?: string;
  modelName?: string;
  content: { appVersion: string; content: Post };
  isDecrypting?: boolean;
  isDecryptedSuccessfully?: boolean;
  isMonetizing?: boolean;
  isMonetizedSuccessfully?: boolean;
  isBuying?: boolean;
  hasBoughtSuccessfully?: boolean;
  isGettingDatatokenInfo?: boolean,
  hasGotDatatokenInfo?: boolean,
}

export type CustomMirror = Omit<Mirror, "mirrorFile"> & {
  mirrorFile: CustomMirrorFile;
};

export type CustomMirrors = CustomMirror[];

export type CustomFolder = Omit<StructuredFolder, "mirrors"> & {
  mirrors: CustomMirror[];
};

export interface LitKit {
  encryptedSymmetricKey: string;
  decryptionConditions: any[];
  decryptionConditionsType: DecryptionConditionsTypes;
}

export enum PostType {
  Public,
  Private,
  Datatoken,
}

export interface PostContent {
  text: string;
  images?: string[];
  videos?: string[];
}

export interface Post {
  postContent: PostContent | string;
  postType: PostType;
  options?: {
    lockedImagesNum?: number;
    lockedVideosNum?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Settings {
  
}

