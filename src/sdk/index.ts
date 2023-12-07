import { DatatokenType } from "@dataverse/dataverse-connector";

export * from "./gql";
export * from "./ceramic";
export * from "./image";
export const DefaultDatatokenType: DatatokenType = (process.env as any)
  .DEFAULT_DATATOKEN_TYPE;
