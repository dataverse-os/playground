export const checkIsExtensionInjected = (): Promise<boolean> => {
  return new Promise((resolve) => {
    let flag = false;
    const interval = setInterval(() => {
      try {
        const res = document.querySelector("#__dataverse__");
        if (res) {
          clearInterval(interval);
          flag = true;
          resolve(true);
        }
      } catch (error) {}
    }, 100);
    setTimeout(() => {
      if (!flag) {
        clearInterval(interval);
        resolve(false);
      }
    }, 1000);
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
  if (self !== top) {
    return true;
  }
  const res = await checkIsExtensionInjected();
  return res;
}
