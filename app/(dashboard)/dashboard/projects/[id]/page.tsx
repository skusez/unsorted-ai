"use server";
import { getProject, getProjectFiles, getUserScore } from "./actions";
import { SIWEController } from "@web3modal/siwe";
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

async function Projects({ params }: { params: { id: string } }) {
  const session = await SIWEController.getSession();
  const userId = session?.id as string;
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getUserScoreQueryKey(userId, params.id),
      queryFn: () => getUserScore(userId, params.id),
    }),
    queryClient.prefetchQuery({
      queryKey: getProjectFilesQueryKey(params.id),
      queryFn: () => getProjectFiles(params.id),
    }),
    queryClient.prefetchQuery({
      queryKey: getProjectQueryKey(params.id),
      queryFn: () => getProject(params.id),
    }),
  ]);
  const state = dehydrate(queryClient);
  return (
    <HydrationBoundary state={state}>
      <ProjectPageClient />
    </HydrationBoundary>
  );
}

export default Projects;
