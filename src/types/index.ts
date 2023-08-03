import {
  StreamRecord,
  IndexFileContentType,
  Mirror,
  MirrorFile,
  StructuredFolder,
} from "@dataverse/dataverse-connector";

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
  options?: {};
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

export interface PostStream {
  streamId: string;
  streamRecord: StreamRecord;
  datatokenInfo?: Partial<{
    address: string;
    collect_info: {
      collect_nft_address: string;
      sold_list: {
        owner: string;
        token_id: string;
      }[];
      price: {
        amount: string;
        currency: string;
        currency_addr: string;
      };
      sold_num: number;
      total: string;
      who_can_free_collect: string[];
    };
    content_uri: string;
    owner: string;
    source: string;
  }>;

  isMonetizing?: boolean;
  isMonetizedSuccessfully?: boolean;
  isUnlocking?: boolean;
  hasUnlockedSuccessfully?: boolean;
  isGettingDatatokenInfo?: boolean;
  hasGotDatatokenInfo?: boolean;
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
