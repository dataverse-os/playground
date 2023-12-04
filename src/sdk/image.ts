import { lighthouseStorage } from "@/utils/lighthouse";

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const imgCIDs = await Promise.all(
    files.map(file => lighthouseStorage.uploadFile(file)),
  );
  const imgUrls = imgCIDs.map(lighthouseStorage.getFileUrl);
  return imgUrls;
};
