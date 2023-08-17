export const richnessList = {
  rich: "커피맛이 진해요",
  bland: "커피맛이 싱거워요",
  bitter: "커피맛이 써요",
} as const;

export type RichnessCode = keyof typeof richnessList;

export const flavorList = {
  sour: "산미가 있어요",
  nutty: "고소해요",
} as const;

export type FlavorCode = keyof typeof flavorList;

export const favoriteFlavor = {
  sour: "산미있는 원두",
  nutty: "고소한 원두",
} as const;
export const favoriteType = {
  americano: "아메리카노",
  cafelatte: "카페라떼",
  drip: "드립커피",
} as const;
export type TypeCode = keyof typeof favoriteType;
