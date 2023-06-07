"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDapp = exports.signMessage = exports.convertToYaml = exports.client = exports.DATAVERSE_ENDPOINT = void 0;
const graphql_request_1 = require("graphql-request");
const dataverse_config_1 = require("../dataverse.config");
const convert_yaml_1 = __importDefault(require("convert-yaml"));
const ethers_1 = require("ethers");
const tool_1 = require("./tool");
const chalk_1 = __importDefault(require("chalk"));
exports.DATAVERSE_ENDPOINT = "https://gateway.beta.dataverse.art/v1/dapp-table";
exports.client = new graphql_request_1.GraphQLClient(`${exports.DATAVERSE_ENDPOINT}/graphql`, {});
function convertToYaml(obj) {
    const str = convert_yaml_1.default.stringify(obj).value;
    // console.log("YAML str: ", str);
    return str;
}
exports.convertToYaml = convertToYaml;
const signMessage = async (msg) => {
    const provider = ethers_1.ethers.getDefaultProvider();
    const signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return await signer.signMessage(msg);
};
exports.signMessage = signMessage;
const getFileSystemModels = async (slug) => {
    const query = (0, graphql_request_1.gql) `
    query RootQuery($slug: String!) {
      getFileSystemModels(slug: $slug)
    }
  `;
    try {
        const res = await exports.client.request(query, { slug: slug });
        // console.log("getDefaultModels Models: ", res.getFileSystemModels);
        return res.getFileSystemModels;
    }
    catch (error) {
        console.log(error?.response?.errors?.[0] ?? error);
    }
};
const createDapp = async () => {
    const models = (0, tool_1.readModels)();
    const params = dataverse_config_1.config;
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
    const signedMsg = await (0, exports.signMessage)(msg);
    const variables = {
        slug: params.slug,
        name: params.name,
        logo: params.logo,
        website: params.website,
        defaultFolderName: params.defaultFolderName,
        description: params.description,
        models: params.models.concat(fileSystemModels.map((model) => {
            return {
                isPublicDomain: false,
                schema: model,
            };
        })),
        originMsg: msg,
        signedMsg: signedMsg,
        ceramicUrl: params.ceramicUrl,
    };
    const query = (0, graphql_request_1.gql) `
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
        const res = await exports.client.request(query, { ...variables });
        (0, tool_1.writeToOutput)(res);
        console.log(chalk_1.default.greenBright("Create successfully, now you can run 'pnpm dev' to run react demo."));
        return res;
    }
    catch (error) {
        console.log(error?.response?.errors?.[0] ?? error);
    }
};
exports.createDapp = createDapp;
(0, exports.createDapp)();
