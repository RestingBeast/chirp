"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { submitStandupAction } from "@/actions/standups";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function StandupForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);

  const [fields, setFields] = useState({
    yesterday: "",
    today: "",
    blockers: "",
  });

  const MAX_CHARS = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setFields({ ...fields, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.teamId) {
      toast.error("You are not assigned to a team.", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);
    const result = await submitStandupAction({
      ...fields,
      teamId: user.teamId,
    });

    if (result.success) {
      toast.success("Standup submitted!", { position: "top-center" });
      router.push("/board");
    } else {
      toast.error(result.message, { position: "top-center" });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Daily Standup</CardTitle>
          <CardDescription>Keep it brief, keep it useful.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Yesterday Section */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="yesterday">What did you do yesterday?</Label>
                <span className="text-xs text-muted-foreground">
                  {fields.yesterday.length}/{MAX_CHARS}
                </span>
              </div>
              <Textarea
                id="yesterday"
                name="yesterday"
                placeholder="Finished the auth middleware..."
                value={fields.yesterday}
                onChange={handleChange}
                required
                className="min-h-25 resize-none"
              />
            </div>

            {/* Today Section */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="today">What are you doing today?</Label>
                <span className="text-xs text-muted-foreground">
                  {fields.today.length}/{MAX_CHARS}
                </span>
              </div>
              <Textarea
                id="today"
                name="today"
                placeholder="Implementing the Team Board UI..."
                value={fields.today}
                onChange={handleChange}
                required
                className="min-h-25 resize-none"
              />
            </div>

            {/* Blockers Section */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="blockers">Any blockers?</Label>
                <span className="text-xs text-muted-foreground">
                  {fields.blockers.length}/{MAX_CHARS}
                </span>
              </div>
              <Textarea
                id="blockers"
                name="blockers"
                placeholder="None"
                value={fields.blockers}
                onChange={handleChange}
                className="min-h-20 resize-none mb-4"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Standup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
