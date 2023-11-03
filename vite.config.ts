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
      PLAYGROUND_APP_ID: "5d2a715d-6601-47bd-8108-21e62b8d9205",
      PLAYGROUND_POST_MODEL_ID:
        "kjzl6hvfrbw6c8ygyls3hllgnh47z50k0anyu2wdwnwlesqkb95n2afrf6pqka1",
      PLAYGROUND_INDEX_FILE_MODEL_ID:
        "kjzl6hvfrbw6c964mm5193nv1zs09sjcttt41nr6tg17a2335yjeg26b9nv9l4t",
    },
  },
});
