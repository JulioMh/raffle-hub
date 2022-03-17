export const roundToFixed = (number: number, decimals: number): number =>
  Math.round((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
