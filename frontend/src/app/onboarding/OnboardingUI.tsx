"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/actions/auth";

export default function OnboardingUI() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isChecking, setIsChecking] = useState(false);

  const handleRefresh = () => {
    setIsChecking(true);
    // This will trigger your AuthGuard or Layout to re-fetch the user profile
    window.location.reload();
  };

  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md text-center shadow-lg border-t-4 border-t-primary">
        <CardHeader className="pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Clock className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl">Pending Assignment</CardTitle>
          <CardDescription className="text-base">
            Welcome,{" "}
            <span className="font-semibold text-foreground">{user?.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          <p className="text-muted-foreground">
            You haven't been assigned to a team yet. Please wait for your
            administrator to add you to a team so you can start posting
            standups.
          </p>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleRefresh}
            disabled={isChecking}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
            />
            {isChecking ? "Checking status..." : "Check Status"}
          </Button>
        </CardContent>
        <div className="pt-4 mt-4 border-t">
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Sign out of {user?.email}
          </button>
        </div>
      </Card>
    </main>
  );
}
