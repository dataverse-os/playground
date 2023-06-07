export interface Model {
  isPublicDomain: boolean;
  schema: string;
  schemaName: string;
}

export interface CreateDappProps {
  slug: string;
  name: string;
  logo: string;
  website: string;
  defaultFolderName: string;
  description: string;
  models: Model[];
  originMsg: string;
  signedMsg: string;
  ceramicUrl: string | null;
}
