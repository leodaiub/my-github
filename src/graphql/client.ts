import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://api.github.com/graphql", {
  headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_GH_TOKEN}` },
});

export const fetcher = (query: string, variables: any) => {
  return client.request(query, variables);
};
