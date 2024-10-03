// Function to generate the user score query key
export const getUserScoreQueryKey = (projectId: string) =>
  ["userScore", projectId] as string[];

// Function to generate the project files query key
export const getProjectFilesQueryKey = (projectId: string) =>
  ["projectFiles", projectId] as string[];

// Function to generate the project query key
export const getProjectQueryKey = (projectId: string) =>
  ["project", projectId] as string[];
