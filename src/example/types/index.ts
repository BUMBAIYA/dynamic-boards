// ------------------- Example Card Content Types -------------------

/**
 * This is the type for the custom card data.
 * User need to implement their own custom card data type according to their own needs/business logic.
 *
 * This is just an example. User can use this as a reference.
 */

export type MockCardContentCustomDataGithubInfo =
  | "profile"
  | "repos"
  | "metrics"
  | "followers";

export type MockCardContentCustomData = {
  title: string;
  description: string;
  githubInfo: MockCardContentCustomDataGithubInfo;
};

export type MockCardContent = {
  customCardData: MockCardContentCustomData;
};
