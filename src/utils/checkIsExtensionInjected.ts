declare const __DATAVERSE_EXTENSION_VERSION__: string;

export const checkIsExtensionInjected = (): Promise<boolean> => {
  // return new Promise((resolve) => {
  //   const interval = setInterval(() => {
  //     try {
  //       __DATAVERSE_EXTENSION_VERSION__;
  //       clearInterval(interval);
  //       resolve(true);
  //     } catch (error) {}
  //   }, 100);
  //   setTimeout(() => {
  //     clearInterval(interval);
  //     resolve(false);
  //   }, 1000);
  // });
  // try {
  //   __DATAVERSE_EXTENSION_VERSION__;
  //   return true;
  // } catch (error) {
  //   return false;
  // }
};

export function detectExtension(extensionId: string): Promise<boolean> {
  const img = new Image();
  img.src = `chrome-extension://${extensionId}/icons/icon-16x16.png`;
  return new Promise((resolve) => {
    img.addEventListener("load", () => {
      resolve(true);
    });
    img.addEventListener("error", () => {
      resolve(false);
    });
  });
}

export async function detectDataverseExtension(): Promise<boolean> {
  if (
    (await detectExtension("kcigpjcafekokoclamfendmaapcljead")) ||
    (await detectExtension("cekpfnklcifiomgeogbmknnmcgbkdpim"))
  ) {
    return true;
  }
  return false;
  // const res = await checkIsExtensionInjected();
  // return res;
}
