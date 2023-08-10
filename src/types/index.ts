import { ModelParser } from "@dataverse/model-parser";

import {
  StreamRecord,
  IndexFileContentType,
  Mirror,
  MirrorFile,
  StructuredFolder,
  Currency,
} from "@dataverse/dataverse-connector";
import { BrowserStorage } from "@/utils";

export enum PostType {
  Public,
  Encrypted,
  Payable,
}

export interface StructuredPost {
  controller: string;
  appVersion: string;
  text?: string;
  images?: string[];
  videos?: string[];
  postType: PostType;
  options?: object;
  createdAt: string;
  updatedAt?: string;
  encrypted?: {
    appVersion?: boolean;
    text?: boolean;
    images?: boolean;
    videos?: boolean;
    postType?: boolean;
    options?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };
}

export interface NativePost {
  controller: string;
  appVersion: string;
  text?: string;
  images?: string[];
  videos?: string[];
  postType: PostType;
  options?: string;
  createdAt: string;
  updatedAt?: string;
  encrypted?: string;
}

export interface CustomMirrorFile extends MirrorFile {
  contentType: IndexFileContentType | string;
  appName?: string;
  modelName?: string;
  content: StructuredPost;
  isMonetizing?: boolean;
  isMonetizedSuccessfully?: boolean;
  isUnlocking?: boolean;
  hasUnlockedSuccessfully?: boolean;
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

export interface StreamRecordMap {
  [streamId: string]: StreamRecord;
}

export type StreamContent = StreamRecord["streamContent"];

export type PlaygroundStateType = {
  appVersion: string;
  modelParser: ModelParser;
  browserStorage?: BrowserStorage;
  sortedStreamIds: string[];
  isDataverseExtension?: boolean;
  isNoExtensionModalVisible: boolean;
  isConnecting: boolean;
};

export type PlaygroundContextType = {
  state: PlaygroundStateType;
  dispatch: React.Dispatch<any>;
};

export enum PlaygroundActionType {
  NewBrowserStorage,
  SetIsDataverseExtension,
  SetSortedStreamIds,
  SetNoExtensionModalVisible,
  SetIsConnecting,
}

export type PrivacySettingsType = {
  postType: PostType;
  currency?: Currency;
  amount?: number;
  collectLimit?: number;
};
