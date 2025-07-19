import { generateRandomId } from "@/core/utils/generateRandomId";
import type { DynamicBoardCard } from "@/core/context/dynamic-board-context";
import type { MockCardContent } from "@/example/types";

export const MOCK_CARD_DATA: DynamicBoardCard<MockCardContent>[] = [
  {
    id: generateRandomId(),
    layoutJson: {
      row: 0,
      col: 0,
      widthPercentage: 50,
      height: 520,
    },
    customCardData: {
      title: "BUMBIAYA",
      description: "This is my github profile",
      githubInfo: "profile",
    },
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 0,
      col: 1,
      widthPercentage: 50,
      height: 520,
    },
    customCardData: {
      title: "Repositories",
      description: "This is my github repositories",
      githubInfo: "repos",
    },
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 1,
      col: 0,
      widthPercentage: 40,
      height: 520,
    },
    customCardData: {
      title: "Metrics",
      description: "This is my github metrics",
      githubInfo: "metrics",
    },
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 1,
      col: 1,
      widthPercentage: 60,
      height: 520,
    },
    customCardData: {
      title: "Followers",
      description: "This is my github followers",
      githubInfo: "followers",
    },
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 2,
      col: 0,
      widthPercentage: 50,
      height: 460,
    },
    customCardData: {
      title: "Random Card 1",
      description: "This is a random card",
      githubInfo: "profile",
    },
  },
  {
    id: generateRandomId(),
    layoutJson: {
      row: 2,
      col: 1,
      widthPercentage: 50,
      height: 460,
    },
    customCardData: {
      title: "Random Card 2",
      description: "This is a random card",
      githubInfo: "profile",
    },
  },
];
