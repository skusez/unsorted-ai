"use client";

import { useRealtime } from "./hooks/useRealtime";
import { ProjectDetails } from "./components/ProjectDetails";
import { UserScore } from "./components/UserScore";
import { ProjectFiles } from "./components/ProjectFiles";

export const ProjectPageClient = () => {
  useRealtime();

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <ProjectDetails />
      <UserScore />
      <ProjectFiles />
    </div>
  );
};
