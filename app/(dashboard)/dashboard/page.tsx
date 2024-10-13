import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TokenBalanceChart from "./user/token-balance-chart";
import DeviceList from "./user/device-list";
import { Header } from "../Header";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { orderBy } from "lodash-es";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "View your token balance, devices, and data usage",
};

// Mock user data
const userData = {
  name: "Alice Johnson",
  tokenBalance: [
    { date: "2023-01-01", balance: 20 },
    { date: "2023-01-02", balance: 30 },
    { date: "2023-01-03", balance: 50 },
    { date: "2023-01-04", balance: 80 },
    { date: "2023-01-05", balance: 120 },
  ],
  devices: [
    { name: "Apple Watch", status: "online", tokensEarned: 50 },
    { name: "iPhone", status: "offline", tokensEarned: 30 },
    { name: "MacBook", status: "online", tokensEarned: 70 },
  ],
};

export default async function DashboardPage() {
  const supabase = createClient();

  // Fetch all projects
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      name,
      description,
      image_url,
      project_data_types (
        data_type_id
      )
    `
    )
    .order("created_at")
    .limit(10); // Limit to 10 projects for this example

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Alert variant="default" className="rounded-none border-none ">
        <AlertDescription className="w-full text-center">
          <Link
            href={`/dashboard/projects/${process.env.NEXT_PUBLIC_DEMO_PROJECT_ID}`}
            className="text-white font-heading hover:underline"
          >
            Try our demo data evaluation
          </Link>
        </AlertDescription>
      </Alert>
      <div className="mb-4">
        <Header />
      </div>
      <div className="space-y-12">
        <section className="space-y-4 max-w-full">
          <h1 className="text-3xl font-bold">Welcome back, {userData.name}</h1>
          <Card>
            <CardHeader>
              <CardTitle>Your Token Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="absolute font-bold text-3xl">
                {
                  userData.tokenBalance[userData.tokenBalance.length - 1]
                    .balance
                }
              </div>
              <TokenBalanceChart data={userData.tokenBalance} />
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Devices</h2>
          <DeviceList devices={userData.devices as any[]} />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Here's where your data is being used
          </h2>
          <div className="w-[calc(100vw-2rem)] sm:w-full -mx-4 sm:mx-0">
            <ScrollArea className="w-full">
              <div className="flex space-x-4 pb-4 px-4 sm:px-0">
                {projects?.map((project) => (
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    key={project.id}
                    prefetch={false}
                  >
                    <Card className="w-[300px] h-[400px] flex-shrink-0">
                      <CardContent className="p-4">
                        <Image
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.name}
                          width={300}
                          quality={100}
                          height={300}
                          className="w-full h-32 object-cover rounded-md mb-4"
                        />
                        <h3 className="font-semibold text-lg">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {(project.description as any)?.description ||
                            "No description available"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.project_data_types.map((type) => (
                            <Badge key={type.data_type_id}>
                              {type.data_type_id}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>
      </div>
    </div>
  );
}
