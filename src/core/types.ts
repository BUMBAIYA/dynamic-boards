export type DynamicBoardDNDCard = {
  id: string;
  layout: {
    row: number;
    col: number;
  };
  title: string;
};

export type DynamicBoardDNDRow = {
  id: string;
  // To get the row element dimensions and position
  rowElementRef?: HTMLDivElement;
  cards: DynamicBoardDNDCard[];
};
