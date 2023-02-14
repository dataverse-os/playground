export function pixelProofing(param: string) {
  try {
    const num = Number(param);
    return `${num}px`;
  } catch (error) {
    return param;
  }
}
