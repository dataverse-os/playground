declare const __DATAVERSE_EXTENSION_VERSION__: string;

export const checkIsExtensionInjected = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      try {
        __DATAVERSE_EXTENSION_VERSION__;
        clearInterval(interval);
        resolve(true);
      } catch (error) {}
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      resolve(false);
    }, 5000);
  });
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
  if (await detectExtension("kcigpjcafekokoclamfendmaapcljead")) {
    return true;
  }
  return false;
}
