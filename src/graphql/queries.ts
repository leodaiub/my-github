export const PAGINATED_REPOS_QUERY = /* GraphQL */ `
  query PAGINATED_REPOS_QUERY($pageSize: Int, $cursor: String) {
    viewer {
      repositories(first: $pageSize, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        nodes {
          name
          stargazerCount
          primaryLanguage {
            name
          }
          updatedAt
        }
      }
    }
  }
`;

export const SINGLE_REPO_QUERY = /* GraphQL */ `
  query SINGLE_REPO_QUERY($repoName: String!, $owner: String!) {
    repository(name: $repoName, owner: $owner) {
      name
      description
      stargazerCount
      updatedAt
      primaryLanguage {
        name
      }
      object(expression: "HEAD:README.md") {
        ... on Blob {
          text
        }
      }
    }
  }
`;
