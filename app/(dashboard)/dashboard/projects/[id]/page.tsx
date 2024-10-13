"use server";
import { getProject, getProjectFiles, getUserScore } from "./actions";

import {
  getProjectFilesQueryKey,
  getProjectQueryKey,
  getUserScoreQueryKey,
} from "./queryKeys";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { ProjectPageClient } from "./page.client";
import { Header } from "@/app/(dashboard)/Header";

async function Projects({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  console.log("prefetching");
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getUserScoreQueryKey(params.id),
      queryFn: () => getUserScore(params.id),
      retry: false,
    }),
    queryClient.prefetchQuery({
      queryKey: getProjectFilesQueryKey(params.id),
      queryFn: () => getProjectFiles(params.id),
      retry: false,
    }),
    queryClient.prefetchQuery({
      queryKey: getProjectQueryKey(params.id),
      queryFn: () => getProject(params.id),
      retry: false,
    }),
  ]);
  const state = dehydrate(queryClient);
  return (
    <HydrationBoundary state={state}>
      <Header />
      <ProjectPageClient />
    </HydrationBoundary>
  );
}

export default Projects;
