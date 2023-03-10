export function pixelProofing(param: string) {
  try {
    const num = Number(param);
    return isNaN(num) ? param : `${num}px`
  } catch (error) {
    return param;
  }
}
