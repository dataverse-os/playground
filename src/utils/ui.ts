export const fade = {
  opacity: [1, 0],
  transition: { duration: 0.8, ease: 'easeOut' },
};

export const show = {
  opacity: [0, 1],
  transition: { duration: 0.8, ease: 'easeOut' },
};

export function pixelProofing(param: string) {
  try {
    const num = Number(param);
    return isNaN(num) ? param : `${num}px`
  } catch (error) {
    return param;
  }
}