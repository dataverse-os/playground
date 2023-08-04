import { web3Storage } from "@/utils";

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const imgCIDs = await Promise.all(
    files.map((file) => web3Storage.storeFiles([file]))
  );
  const imgUrls = imgCIDs.map((cid) => `https://${cid}.ipfs.w3s.link`);
  return imgUrls;
};
