"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [subscriptionTier, setSubscriptionTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const supabase = createClient();

  const subscriptionTiers = useQuery({
    queryKey: ["subscriptionTiers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subscriptions").select("*");
      return data;
    },
  });
  console.log(subscriptionTiers.data);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!session?.id) {
      toast.error("You must be logged in to create a project.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          owner_id: session.id,
          name,
          description: JSON.stringify({ description }),
          image_url: imageUrl,
          data_limit: 1000000, // Default data limit in bytes (1MB)
          current_data_usage: 0, // Initial data usage
          status: "Proposed",
          subscription_id: subscriptionTier,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created successfully!");
      router.push(`/dashboard/projects/${data.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error creating project:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subscriptionTier">Subscription Tier</Label>
              <Select
                value={subscriptionTier}
                onValueChange={setSubscriptionTier}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionTiers.data?.map((tier) => (
                    <SelectItem key={tier.id} value={tier.id}>
                      {tier.tier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
