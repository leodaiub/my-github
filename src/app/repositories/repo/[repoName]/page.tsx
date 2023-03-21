import React from "react";
import { SINGLE_REPO_QUERY } from "@/graphql/queries";
import { Metadata } from "next";
import { fetcher } from "@/graphql/client";
import RepoPage from "@/components/RepoPage";
import { Repository } from "@/types/repository";

export default function Page({
  params: { repoName },
}: {
  params: { repoName: string };
}) {
  return <RepoPage repoName={repoName} />;
}

export async function generateMetadata({
  params: { repoName },
}: {
  params: { repoName: string };
}): Promise<Metadata> {
  const data = (await fetcher(SINGLE_REPO_QUERY, {
    repoName,
    owner: "leodaiub",
  })) as { repository: Repository };
  return { title: `${data?.repository.name} | My Github` };
}
