"use client";
import { PAGINATED_REPOS_QUERY } from "@/graphql/queries";
import { useStore } from "@/store/store";
import { RepoListResponse, Repository } from "@/types/repository";
import { Link } from "@chakra-ui/next-js";
import { Stack, Skeleton, Card, CardBody, Flex, Text } from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function RepoList({ page }: { page: number }) {
  const PAGE_SIZE = 5;
  const router = useRouter();
  const { loading, pagesEndCursors: endCursors } = useStore((state) => state);

  const { data, isLoading = true } = useSWR<RepoListResponse>(
    endCursors.length > 1
      ? [
          PAGINATED_REPOS_QUERY,
          {
            pageSize: PAGE_SIZE,
            cursor: endCursors[Number(page) - 2] || null,
          },
        ]
      : null
  );

  return (
    <Stack mt="20">
      {(isLoading || loading) &&
        new Array(PAGE_SIZE)
          .fill("")
          .map((_, i) => (
            <Skeleton key={i} h={100} isLoaded={!isLoading && !loading} />
          ))}
      {data?.viewer.repositories.nodes.map((repo: Repository) => (
        <Card h="100px" key={repo.name}>
          <CardBody>
            <Link
              href={"/repositories/repo/" + repo.name}
              color="blue.400"
              _hover={{
                color: "blue.500",
              }}
            >
              <Text>{repo.name}</Text>
            </Link>
            <Text>{repo.primaryLanguage?.name}</Text>

            <Text>
              {repo.updatedAt && format(new Date(repo.updatedAt), "dd.MM.yyy")}
            </Text>
          </CardBody>
        </Card>
      ))}
      <Flex w="full" p={50} alignItems="center" justifyContent="center" mt="5">
        {(isLoading || loading) && (
          <Skeleton h={50} w={400} isLoaded={!isLoading && !loading}></Skeleton>
        )}
        <Pagination
          pageSize={PAGE_SIZE}
          focusRing
          colorScheme="teal"
          defaultCurrent={Number(page) || 1}
          total={data?.viewer.repositories.totalCount}
          paginationProps={{
            display: "flex",
          }}
          onChange={(page) => router.push("repositories/page/" + String(page))}
        />
      </Flex>
    </Stack>
  );
}
