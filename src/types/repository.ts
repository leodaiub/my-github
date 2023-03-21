export type Repository = {
  name: string;
  description: string;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
  };
  object: {
    text: string;
  };
  updatedAt: string;
};

export type RepositoryReponse = {
  repository: Repository;
};

export type RepoListResponse = {
  viewer: {
    repositories: {
      totalCount: number;
      pageInfo: { endCursor: string; hasNextPage: boolean };
      nodes: Repository[];
    };
  };
};
