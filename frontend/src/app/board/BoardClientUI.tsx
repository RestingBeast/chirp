"use client";

import { useAuthStore } from "@/store/authStore";
import { logoutAction } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface Standup {
  _id: string;
  yesterday: string;
  today: string;
  blockers: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

export default function BoardClientUI({
  initialStandups,
  date,
}: {
  initialStandups: Standup[];
  date: string;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-8 rounded-xl border shadow-sm">
        {/* Left Side: Stays the same, but p-8 gives it more breathing room */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Team Standup Board
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Showing updates for{" "}
            <span className="text-foreground font-semibold">{date}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Logged in as <span className="text-foreground">{user?.name}</span>
          </p>
        </div>

        {/* Right Side: Scaled and Centered */}
        <div className="flex items-center gap-4">
          {/* Increased padding and text size for the Badge */}
          <Badge
            variant="secondary"
            className="px-8 py-4 text-sm font-semibold bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {initialStandups.length} Updates
          </Badge>

          <Separator orientation="vertical" className="h-10 hidden md:block" />

          {/* Using a standard button size instead of ghost to give it more presence */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 border-dashed"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid of Standup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialStandups.map((s) => (
          <Card
            key={s._id}
            className="flex flex-col transition-all hover:shadow-md border-t-4 border-t-primary"
          >
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{s.userId.name}</CardTitle>
                <div className="flex items-center text-[10px] text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(s.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <CardDescription className="text-xs truncate">
                {s.userId.email}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase text-muted-foreground flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                  Yesterday
                </h4>
                <p className="text-sm leading-relaxed text-card-foreground/90">
                  {s.yesterday}
                </p>
              </div>

              <Separator className="opacity-50" />

              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase text-muted-foreground flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                  Today
                </h4>
                <p className="text-sm leading-relaxed text-card-foreground/90">
                  {s.today}
                </p>
              </div>

              {s.blockers && s.blockers.toLowerCase() !== "none" && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <h4 className="text-[11px] font-bold uppercase text-destructive flex items-center mb-1">
                    <AlertCircle className="w-3 h-3 mr-1.5" />
                    Blockers
                  </h4>
                  <p className="text-sm text-destructive/90 italic">
                    "{s.blockers}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {initialStandups.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Clock className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No standups posted yet
            </h3>
            <p className="text-sm text-muted-foreground/60">
              The team is still brewing their coffee...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
