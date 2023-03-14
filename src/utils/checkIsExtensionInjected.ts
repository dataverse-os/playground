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
