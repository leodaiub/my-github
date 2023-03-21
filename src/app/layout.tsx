/* eslint-disable no-unused-vars */
"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, Container } from "@chakra-ui/react";
import theme from "./theme";
import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";

import { fetcher } from "@/graphql/client";
import { PAGINATED_REPOS_QUERY } from "@/graphql/queries";
import { SWRConfig } from "swr";
import { useStore } from "@/store/store";
import Head from "next/head";
import { RepoListResponse, RepositoryReponse } from "@/types/repository";

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
        const data = (await fetcher(PAGINATED_REPOS_QUERY, {
          pageSize: PAGE_SIZE,
          cursor: endCursor || null,
        })) as RepoListResponse;

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
      <Head>
        <title>My Github</title>
      </Head>

      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SWRConfig
          value={{
            fetcher: ([query, variables]) => fetcher(query, variables),
          }}
        >
          <CacheProvider>
            <ChakraProvider theme={theme} cssVarsRoot="body">
              <Container h="100vh">
                <NavBar />
                {children}
              </Container>
            </ChakraProvider>
          </CacheProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
