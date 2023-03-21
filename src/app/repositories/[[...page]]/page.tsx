import RepoList from "@/components/RepoList";
import { Metadata } from "next";
import React from "react";

export default function Page({
  params: { page },
}: {
  // page number will be on page[1]
  params: { page: ["page", number] };
}) {
  return <RepoList page={page?.[1]}></RepoList>;
}

export async function generateMetadata({
  params: { page },
}: {
  params: { page: ["page", number] };
}): Promise<Metadata> {
  return {
    title: `${
      page?.[1] ? `Page ${+page?.[1]} |` : ""
    } Repositories | My Github`,
  };
}
