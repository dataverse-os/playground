export const checkImgExists = (imgUrl: string) =>
  new Promise((resolve, reject) => {
    const imgObj = new Image();
    imgObj.src = imgUrl;
    imgObj.addEventListener("load", (res) => {
      resolve(res);
    });
    imgObj.addEventListener("onerror", (err) => {
      reject(err);
    });
  });

export const getDidFromAddress = (address: string) =>
  `did:pkh:eip155:${
    process.env.IS_MAINNET === "false" ? "80001" : "137"
  }:${address}`;

export const getAddressFromDid = (did: string) =>
  did.slice(did.lastIndexOf(":") + 1);

export const proxy = (url: string) =>
  `${process.env.PROXY}?url=${encodeURIComponent(url)}`;
