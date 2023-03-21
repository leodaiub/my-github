"use client";
import { Link } from "@chakra-ui/next-js";
import { Card, CardBody, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { format } from "date-fns";
import { fetcher, useStore } from "@/app/layout";

const PAGE_SIZE = 5;

export default function Page({
  params: { page },
}: {
  // page number will be on page[1]
  params: { page: ["page", number] };
}) {
  const router = useRouter();
  const { loading, pagesEndCursors: endCursors } = useStore((state) => state);

  const { data, isLoading = true } = useSWR<any, any>(
    endCursors.length > 1
      ? `{
      viewer {
        repositories(first: ${PAGE_SIZE}, after: ${JSON.stringify(
          endCursors[Number(page?.[1]) - 2] || null
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
      }`
      : null,
    fetcher
  );

  return (
    <Stack mt="20">
      {isLoading ||
        (loading &&
          new Array(PAGE_SIZE)
            .fill("")
            .map((_, i) => (
              <Skeleton key={i} h={100} isLoaded={!isLoading && !loading} />
            )))}
      {data?.viewer.repositories.nodes.map((repo: any) => (
        <Card h="100px" key={repo.name}>
          <CardBody>
            <Link
              href={"/repositories/repo/" + repo.name}
              color="blue.400"
              _hover={{ color: "blue.500" }}
            >
              <Text>{repo.name}</Text>
            </Link>
            <Text>{repo.primaryLanguage?.name}</Text>

            <Text>{format(new Date(repo.updatedAt) || "", "dd.MM.yyy")}</Text>
          </CardBody>
        </Card>
      ))}
      <Flex w="full" p={50} alignItems="center" justifyContent="center" mt="5">
        <Skeleton h="50px" isLoaded={!isLoading}>
          <Pagination
            pageSize={PAGE_SIZE}
            focusRing
            colorScheme="teal"
            defaultCurrent={Number(page?.[1]) || 1}
            total={data?.viewer.repositories.totalCount}
            paginationProps={{
              display: "flex",
            }}
            onChange={(page) =>
              router.push("repositories/page/" + String(page))
            }
          />
        </Skeleton>
      </Flex>
    </Stack>
  );
}
