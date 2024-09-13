import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { ProjectFiles } from "./ProjectFiles";
import { ProjectStatistics } from "./ProjectStatistics";

export const ProjectTabs = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Tabs defaultValue="statistics">
          <TabsList>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="file-dropzone">Contributions</TabsTrigger>
          </TabsList>
          <TabsContent value="statistics">
            <ProjectStatistics />
          </TabsContent>
          <TabsContent value="file-dropzone">
            <ProjectFiles />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
