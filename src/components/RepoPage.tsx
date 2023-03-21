"use client";
import { SINGLE_REPO_QUERY } from "@/graphql/queries";
import { Repository } from "@/types/repository";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Card,
  CardHeader,
  HStack,
  Button,
  Skeleton,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  CardBody,
  Stack,
  Divider,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import useSWR from "swr";

export default function RepoPage({ repoName }: { repoName: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR<{ repository: Repository }>([
    SINGLE_REPO_QUERY,
    { repoName, owner: "leodaiub" },
  ]);
  return (
    <>
      <Card>
        <CardHeader>
          <HStack justifyContent="space-between" alignItems="flex-start">
            <Button onClick={() => router.back()} width={50}>
              <ChevronLeftIcon />
            </Button>
            <Skeleton height="30px" isLoaded={!isLoading}>
              <Heading>{data?.repository.name}</Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <Stat>
                <StatLabel>Stargazers</StatLabel>
                <StatNumber>{data?.repository.stargazerCount}</StatNumber>
              </Stat>
            </Skeleton>
          </HStack>
        </CardHeader>
        <CardBody maxH="80vh" overflow="scroll">
          <Stack>
            <Skeleton isLoaded={!isLoading}>
              <Text>
                <b>Primary language:</b>{" "}
                {data?.repository.primaryLanguage?.name}
              </Text>

              <Text>
                <b>Last updated: </b>
                {data?.repository.updatedAt
                  ? format(new Date(data?.repository.updatedAt), "dd.MM.yyy")
                  : null}
              </Text>
            </Skeleton>
            <Divider />
            <Skeleton isLoaded={!isLoading}>
              <Text>{data?.repository.description}</Text>
            </Skeleton>
            <Divider />
            <Skeleton isLoaded={!isLoading}>
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dark as any}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
              >
                {data?.repository.object?.text || ""}
              </ReactMarkdown>
            </Skeleton>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
