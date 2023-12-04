import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      web3: "web3/dist/web3.min.js",
      "@": path.resolve(__dirname, "./src"),
      // buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6", // add buffer
    },
  },
  // esbuild: {
  //   jsxFactory: "jsx",
  //   jsxInject: `import React from 'react'`,
  // },
  build: {
    target: "es2020",
    sourcemap: true,
  },
  server: {
    port: 2234,
    host: "0.0.0.0",
  },
  define: {
    "process.env": {
      ENV: "Browser",
      IPFS_WEB3STORAGE: "https://w3s.link/ipfs/",
      PROXY: "https://api.dataverse.art/raw",
      DATAVERSE_ENDPOINT: "https://gateway.beta.dataverse.art/v1/data-token",
      DATAVERSE_OS: "https://dataverse-os.com",
      MUMBAI_FAUCET: "https://mumbaifaucet.com",
      DATAVERSE_GOOGLE_STORE:
        "https://chrome.google.com/webstore/detail/dataverse/kcigpjcafekokoclamfendmaapcljead",
      CERAMIC_API: "https://dataverseceramicdaemon.com",
      LIGHTHOUSE_API_KEY: "9d632fe6.e756cc9797c345dc85595a688017b226",
      LIGHTHOUSE_IPFS_GATEWAY: "https://gateway.lighthouse.storage/ipfs",
    },
  },
});
