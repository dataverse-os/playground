export function didAbbreviation(did?: string) {
  if (!did) return;
  return `${did.slice(0, 25)}...${did.slice(-4, did.length)}`;
}

export function getAddressFromDid(did: string) {
  return did.slice(did.lastIndexOf(":") + 1);
}

export function addressAbbreviation(address?: string) {
  if (!address) return;
  return `${address.slice(0, 6)}...${address.slice(-4, address.length)}`;
}
