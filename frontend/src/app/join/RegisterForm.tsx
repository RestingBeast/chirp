"use client";

import { registerAction } from "@/actions/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterProps {
  prefilledEmail: string;
  inviteToken: string;
}

export default function RegisterForm({
  prefilledEmail,
  inviteToken,
}: RegisterProps) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [fields, setFields] = useState({
    name: "",
    email: prefilledEmail,
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fields.password !== fields.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    const result = await registerAction({ ...fields, inviteToken });

    if (result.success) {
      setUser(result.user);
      router.push("/board");
      router.refresh();
    } else {
      setError(result.message);
      if (result.errors) {
        const errors = Object.fromEntries(
          result.errors.map((e: any) => [e.field, e.message]),
        );
        setFieldErrors(errors);
      }
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Complete Registration
          </CardTitle>
          <CardDescription>
            Creating account for {prefilledEmail}
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ada Lovelace"
                value={fields.name}
                onChange={handleChange}
                required
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={fields.email}
                onChange={handleChange}
                required
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="min. 8 characters"
                value={fields.password}
                onChange={handleChange}
                required
              />
              {fieldErrors.password && (
                <p className="text-xs text-destructive">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={fields.confirmPassword}
                onChange={handleChange}
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
