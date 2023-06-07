"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    slug: "PlaygroundTest",
    name: "PlaygroundTest",
    logo: "",
    website: "",
    defaultFolderName: "Untitled",
    description: "",
    models: [
        {
            isPublicDomain: false,
            schemaName: "post.graphql",
            encryptable: ["text", "images", "videos"], // strings within the schema and within the array represent fields that may be encrypted, while fields within the schema but not within the array represent fields that will definitely not be encrypted
        },
        {
            isPublicDomain: true,
            schemaName: "profile.graphql",
        },
    ],
    ceramicUrl: null, // leave null to use dataverse test Ceramic node. Set to {Your Ceramic node Url} for mainnet, should start with "https://".
};
