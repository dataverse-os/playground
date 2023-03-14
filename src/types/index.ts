import {
  DecryptionConditionsTypes,
  FileType,
  IndexFile,
  IndexFileContentType,
  Mirror,
  MirrorFile,
  StructuredFolder,
} from "@dataverse/runtime-connector";

export interface PostStream {
  streamId: string;
  streamContent: {
    appVersion: string;
    content: { appVersion: string; content: string | Post; controller: string };
    controller: string;
    contentId: string;
    contentType: IndexFileContentType;
    comment: object;
    relation?: object;
    additional?: object;
    datatokenId?: string;
    fileType: FileType;
    encryptedSymmetricKey?: string;
    decryptionConditions?: any[];
    decryptionConditionsType?: DecryptionConditionsTypes;
    createdAt: string;
    updatedAt: string;
    deleted?: boolean;
  };
  isDecrypting?: boolean;
  isDecryptedSuccessfully?: boolean;
  isMonetizing?: boolean;
  isMonetizedSuccessfully?: boolean;
  isBuying?: boolean;
  hasBoughtSuccessfully?: boolean;
  isGettingDatatokenInfo?: boolean;
  hasGotDatatokenInfo?: boolean;
}

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
  isGettingDatatokenInfo?: boolean;
  hasGotDatatokenInfo?: boolean;
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

export interface Settings {}
