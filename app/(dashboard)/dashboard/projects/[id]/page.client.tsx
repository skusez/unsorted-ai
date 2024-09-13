"use client";

import { useRealtime } from "./hooks/useRealtime";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectTabs } from "./components/ProjectTabs";

export const ProjectPageClient = () => {
  useRealtime();

  return (
    <div className="w-full">
      <ProjectHeader />
      <ProjectTabs />
    </div>
  );
};
