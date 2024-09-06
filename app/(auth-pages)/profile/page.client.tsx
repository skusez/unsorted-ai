import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Component() {
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail(newEmail);
    setIsEditing(false);
    setNewEmail("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="User avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>John Doe</CardTitle>
            <CardDescription>Account Information</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center mt-1">
              <Input id="email" value={email} readOnly className="flex-grow" />
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          </div>
          <div>
            <Label>Date Registered</Label>
            <Input value="January 15, 2023" readOnly />
          </div>
          {isEditing && (
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Email</Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
