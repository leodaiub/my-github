/* eslint-disable no-unused-vars */
"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, Container } from "@chakra-ui/react";
import theme from "./theme";
import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { create } from "zustand";
import produce from "immer";
import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("https://api.github.com/graphql", {
  headers: { authorization: `Bearer ${process.env.NEXT_PUBLIC_GH_TOKEN}` },
});

export const fetcher = (query: any) => client.request(query);

interface IState {
  pagesEndCursors: string[];
  setPagesEndCursors: (_endCursors: string[]) => void;
  loading: boolean;
  setLoading: (_loading: boolean) => void;
}

export const useStore = create<IState>((set) => ({
  pagesEndCursors: [""],
  setPagesEndCursors: (endCursors: string[]) =>
    set(
      produce((state) => {
        state.pagesEndCursors = endCursors;
      })
    ),
  loading: true,
  setLoading: (loading: boolean) =>
    set(
      produce((state) => {
        state.loading = loading;
      })
    ),
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setPagesEndCursors = useStore((state) => state.setPagesEndCursors);
  const { setLoading } = useStore((state) => state);

  const getPagesEndCursor = async () => {
    try {
      const PAGE_SIZE = 5;
      let endCursor = "";
      let endCursors = [];

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const data: any = await fetcher(`{
          viewer {
            repositories(first: ${PAGE_SIZE}, after: ${JSON.stringify(
          endCursor || null
        )}) {
              pageInfo {hasNextPage, endCursor}
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
        }`);

        endCursor = data.viewer.repositories.pageInfo.endCursor;
        endCursors.push(endCursor);

        if (!data.viewer.repositories.pageInfo.hasNextPage) break;
      }
      setPagesEndCursors(endCursors);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPagesEndCursor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <CacheProvider>
          <ChakraProvider theme={theme} cssVarsRoot="body">
            <Container h="100vh">
              <NavBar />
              {children}
            </Container>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
