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
import { changePasswordAction } from "@/actions/auth";

export default function ChangePasswordForm() {
  const [fields, setFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!fields.oldPassword || !fields.newPassword || !fields.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (fields.newPassword.length < 8) {
      setFieldErrors({ newPassword: "Password must be at least 8 characters." });
      return;
    }

    if (fields.newPassword !== fields.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    const result = await changePasswordAction({
      oldPassword: fields.oldPassword,
      newPassword: fields.newPassword,
    });
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else if (result.errors) {
      const errors = Object.fromEntries(
        result.errors.map((e: any) => [e.field, e.message]),
      );
      setFieldErrors(errors);
      if (!errors.oldPassword && !errors.newPassword) {
        setError(result.message);
      }
    } else {
      setError(result.message);
    }
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
              {fieldErrors.oldPassword && (
                <p className="text-xs text-destructive">{fieldErrors.oldPassword}</p>
              )}
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
              {fieldErrors.newPassword && (
                <p className="text-xs text-destructive">{fieldErrors.newPassword}</p>
              )}
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
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
              )}
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
