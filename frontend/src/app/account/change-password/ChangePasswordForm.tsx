"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Lock } from "lucide-react";

export default function ChangePasswordForm() {
  const [fields, setFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fields.oldPassword || !fields.newPassword || !fields.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (fields.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (fields.newPassword !== fields.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    // TODO: Call server action when backend endpoint is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Password changed
            </CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/board" className="w-full">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-muted-foreground" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Change password
            </CardTitle>
          </div>
          <CardDescription>
            Enter your current password and a new one.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="oldPassword">Current password</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="••••••••"
                value={fields.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={fields.newPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={fields.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating password…" : "Update password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
