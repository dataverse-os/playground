import {
  DecryptionConditionsTypes,
  FileType,
  IndexFile,
  IndexFileContentType,
  Mirror,
  MirrorFile,
  StreamContent,
  StructuredFolder,
} from "@dataverse/core-connector";

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
  // streamContent: {
  //   appVersion: string;
  //   content: StructuredPost;
  //   controller: string;
  //   indexFileId: string;
  //   contentId: string;
  //   contentType: IndexFileContentType;
  //   comment: object;
  //   relation?: object;
  //   additional?: object;
  //   datatokenId?: string;
  //   fileType: FileType;
  //   encryptedSymmetricKey?: string;
  //   decryptionConditions?: any[];
  //   decryptionConditionsType?: DecryptionConditionsTypes;
  //   createdAt: string;
  //   updatedAt: string;
  //   deleted?: boolean;
  //   datatokenInfo?: {
  //     address: string;
  //     collect_info: {
  //       collect_nft_address: string;
  //       sold_list: {
  //         owner: string;
  //         token_id: string;
  //       }[];
  //       price: {
  //         amount: string;
  //         currency: string;
  //         currency_addr: string;
  //       };
  //       sold_num: number;
  //       total: string;
  //       who_can_free_collect: string[];
  //     };
  //     content_uri: string;
  //     owner: string;
  //     source: string;
  //   };
  // };

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

export interface Model {
  name: string;
  stream_id: string;
  isPublicDomain: boolean;
  encryptable?: string[];
}

export interface Output {
  createDapp: {
    id?: string;
    streamIDs: Model[];
    website: string;
    name: string;
    slug: string;
    logo: string;
    description: string;
    defaultFolderName: string;
  };
}

export interface StreamsRecord {
  [streamId: string]: StreamRecord;
}

export interface StreamRecord {
  app: string;
  pkh: string;
  modelId: string;
  streamContent: StreamContent;
}
