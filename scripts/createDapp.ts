import { gql, GraphQLClient } from "graphql-request";
import { config } from "../dataverse.config";
import JSToYaml from "convert-yaml";
import { ethers } from "ethers";
import { readModels, writeToOutput } from "./tool";
import { CreateDappProps } from "./types";
import chalk from "chalk";

export const DATAVERSE_ENDPOINT =
  "https://gateway.beta.dataverse.art/v1/dapp-table";

export const client = new GraphQLClient(`${DATAVERSE_ENDPOINT}/graphql`, {});

export function convertToYaml(obj: Object) {
  const str = JSToYaml.stringify(obj).value;
  // console.log("YAML str: ", str);
  return str;
}

export const signMessage = async (msg: string) => {
  const provider = ethers.getDefaultProvider();
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  return await signer.signMessage(msg);
};

const getFileSystemModels = async (slug: string) => {
  const query = gql`
    query RootQuery($slug: String!) {
      getFileSystemModels(slug: $slug)
    }
  `;
  try {
    const res: any = await client.request(query, { slug: slug });
    // console.log("getDefaultModels Models: ", res.getFileSystemModels);
    return res.getFileSystemModels;
  } catch (error: any) {
    console.log(error?.response?.errors?.[0] ?? error);
  }
};

export const createDapp = async () => {
  const models = readModels();
  const params = config as CreateDappProps;

  if (!params.slug) {
    console.log("The slug cannot be empty.");
    return;
  }

  if (!params.name) {
    console.log("The name cannot be empty.");
    return;
  }

  const fileSystemModels = await getFileSystemModels(params.slug);

  const schemas = Object.values(models);
  const msgObj = {
    Operation: "I want to create a DataverseOS app.",
    Slug: params.slug,
    Ceramic: params.ceramicUrl,
    Models: schemas.concat(fileSystemModels),
  };

  params.models.forEach((model) => {
    model.schema = models[model.schemaName];
  });

  const msg = convertToYaml(msgObj);
  const signedMsg = await signMessage(msg!);

  const variables: CreateDappProps = {
    slug: params.slug,
    name: params.name,
    logo: params.logo,
    website: params.website,
    defaultFolderName: params.defaultFolderName,
    description: params.description,
    models: params.models.concat(
      fileSystemModels.map((model: string) => {
        return {
          isPublicDomain: false,
          schema: model,
        };
      })
    ),
    originMsg: msg!,
    signedMsg: signedMsg,
    ceramicUrl: params.ceramicUrl,
  };

  const query = gql`
    query CreateDapp(
      $slug: String!
      $name: String!
      $logo: String!
      $website: String!
      $defaultFolderName: String!
      $description: String!
      $models: [Model!]!
      $originMsg: String!
      $signedMsg: String!
      $ceramicUrl: String
    ) {
      createDapp(
        slug: $slug
        name: $name
        logo: $logo
        website: $website
        defaultFolderName: $defaultFolderName
        description: $description
        models: $models
        originMsg: $originMsg
        signedMsg: $signedMsg
        ceramicUrl: $ceramicUrl
      ) {
        id
        streamIDs {
          name
          stream_id
          isPublicDomain
          encryptable
        }
        website
        name
        slug
        logo
        description
        defaultFolderName
        ceramic
      }
    }
  `;

  try {
    const res: any = await client.request(query, { ...variables });
    writeToOutput(res);
    console.log(
      chalk.greenBright(
        "Create successfully, now you can run 'pnpm dev' to run react demo."
      )
    );
    return res;
  } catch (error: any) {
    console.log(error?.response?.errors?.[0] ?? error);
  }
};

createDapp();
