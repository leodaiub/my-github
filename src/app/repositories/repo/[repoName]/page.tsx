"use client";
import {
  Button,
  Card,
  CardBody,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, StarIcon } from "@chakra-ui/icons";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetcher } from "@/app/layout";

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
};

export default function Page({
  params: { repoName },
}: {
  params: { repoName: string };
}) {
  const router = useRouter();
  const { data, isLoading } = useSWR<{ repository: Repository }, any, any>(
    `{
      repository(name: "${repoName}", owner: "leodaiub"){
        name
        description
        stargazerCount
        primaryLanguage {
          name
        }
        object(expression: "HEAD:README.md") {
          ... on Blob {
            text
          }
        }
      }
    }`,
    fetcher
  );

  return (
    <Stack mt="10">
      <Button onClick={() => router.back()} width={50}>
        <ChevronLeftIcon />
      </Button>
      <Skeleton mt="10" height="30px" isLoaded={!isLoading}>
        <Text>{data?.repository.name}</Text>
      </Skeleton>
      <Skeleton mt="10" isLoaded={!isLoading}>
        <Card width={75}>
          <CardBody>
            <Text>
              <StarIcon />
              {data?.repository.stargazerCount}
            </Text>
          </CardBody>
        </Card>
      </Skeleton>
      <Skeleton mt="10" isLoaded={!isLoading}>
        <Text>{data?.repository.description}</Text>
      </Skeleton>
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
        {data?.repository.object.text || ""}
      </ReactMarkdown>
      <Skeleton mt="10" minH="80vh" isLoaded={!isLoading}></Skeleton>
    </Stack>
  );
}
