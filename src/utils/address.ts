export function didAbbreviation(did?: string, reduce: number = 0) {
  if (!did) return;
  return `${did.slice(0, 25 - reduce)}...${did.slice(-4, did.length)}`;
}

export function getAddressFromDid(did: string) {
  return did.slice(did.lastIndexOf(":") + 1);
}

export function addressAbbreviation(address?: string) {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-4, address.length)}`;
}

export function getNamespaceAndReferenceFromDID(did: string) {
  const res = did.match("did:pkh:([-a-z0-9]{3,8}):([-_a-zA-Z0-9]{1,32})");
  if (!res) {
    throw new Error("Not in pkhDID format");
  }
  return {
    namespace: res[1],
    reference: res[2],
  };
}
