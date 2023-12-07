import lighthouse from "@lighthouse-web3/sdk";

export class LighthouseStorage {
  uploadFile = async (file: File) => {
    const cid = (
      await lighthouse.upload([file], process.env.LIGHTHOUSE_API_KEY!)
    ).data.Hash;
    return cid;
  };
  getFileUrl = (cid: string) => {
    return process.env.LIGHTHOUSE_IPFS_GATEWAY! + "/" + cid;
  };
}

export const lighthouseStorage = new LighthouseStorage();
