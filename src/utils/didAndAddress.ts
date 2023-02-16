export function didAbbreviation(did?: string) {
  if (!did) return;
  return `${did.slice(0, 25)}...${did.slice(-4, did.length)}`;
}

export const getAddressFromDid = (did: string) =>
  did.slice(did.lastIndexOf(":") + 1);
