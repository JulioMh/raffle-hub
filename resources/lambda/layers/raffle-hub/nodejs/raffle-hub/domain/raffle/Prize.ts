export enum PrizeType {
  WL_SPOT,
  NFT,
}

export interface Prize {
  readonly type: PrizeType;
  readonly amount: number;
}
