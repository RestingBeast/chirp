"use client";

import { useAuthStore } from "@/store/authStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Plus,
  CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateTeamDigestAction } from "@/actions/admin";
import { toast } from "sonner";
import Link from "next/link";

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

interface Digest {
  summary: string;
  generatedAt: string;
}

interface BoardClientUIProps {
  initialStandups: Standup[];
  date: string;
  teamId: string;
  digest?: Digest;
}

// Format a Date object to "YYYY-MM-DD" in Singapore time
function toSGDateString(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Singapore",
  });
}

export default function BoardClientUI({
  initialStandups,
  date,
  teamId,
  digest,
}: BoardClientUIProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const todaySG = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Singapore",
  });
  const isEarlier = date < todaySG;

  const [isGenerating, setIsGenerating] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Parse the incoming date string into a Date object for the Calendar
  // Using noon UTC to avoid timezone-shifting the date to the day before
  const selectedDate = date ? new Date(`${date}T12:00:00Z`) : new Date();

  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    const result = await generateTeamDigestAction(teamId);
    if (result.success) {
      toast.success("Digest Generated!", { position: "top-center" });
    } else {
      toast.error(result.message, { position: "top-center" });
    }
    setIsGenerating(false);
  };

  const handleDateSelect = (picked: Date | undefined) => {
    if (!picked) return;

    const formatted = toSGDateString(picked);
    const params = new URLSearchParams({ date: formatted });

    // Only append teamId for admins
    if (user?.role === "admin" && teamId) {
      params.set("teamId", teamId);
    }

    setCalendarOpen(false);
    router.replace(`/board?${params.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Back Button */}
      {user?.role === "admin" && (
        <div className="ml-2 mb-4">
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 text-muted-foreground hover:text-primary transition-all group font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Admin Console
            </Button>
          </Link>
        </div>
      )}

      {/* 2. Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card p-8 rounded-xl border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Team Standup Board
          </h1>

          {/* Clickable date — opens calendar popover */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger className="ml-1">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                <CalendarIcon className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                Showing updates for{" "}
                <span className="text-foreground font-semibold underline underline-offset-4 decoration-dashed decoration-muted-foreground/50 group-hover:decoration-primary transition-colors">
                  {date}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                // Prevent selecting future dates
                disabled={(d: Date) => d > new Date()}
              />
            </PopoverContent>
          </Popover>

          <p className="ml-1 text-xs text-muted-foreground">
            Logged in as <span className="text-foreground">{user?.name}</span>
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="px-8 py-4 text-sm font-semibold bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {initialStandups.length} Updates
          </Badge>

          <Separator orientation="vertical" className="h-10 hidden md:block" />

          {user?.role === "admin" ? (
            <Button
              onClick={handleGenerateDigest}
              disabled={isGenerating || initialStandups.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {digest ? "Regenerate Digest" : "Generate AI Digest"}
            </Button>
          ) : (
            <Link href="/standup/new">
              <Button
                variant="outline"
                size="lg"
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 border-dashed"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Standup
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 3. Digest Card */}
      {digest && (
        <Card className="mb-8 border-none bg-linear-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 shadow-inner">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider">
                AI Team Pulse
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium leading-relaxed italic text-slate-700 dark:text-slate-200">
              "{digest.summary}"
            </p>
          </CardContent>
          <CardFooter className="text-[10px] text-muted-foreground flex justify-between items-center border-t border-indigo-100/50 dark:border-slate-700 mt-2 pt-4">
            <span>Generated via Llama 3.3 (Groq)</span>
            <span>{new Date(digest.generatedAt).toLocaleTimeString()}</span>
          </CardFooter>
        </Card>
      )}

      {/* 4. Grid of Standup Cards */}
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

        {initialStandups.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/20">
            <Clock className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No standups posted {!isEarlier && "yet"}
            </h3>
            <p className="text-sm text-muted-foreground/60">
              {isEarlier
                ? "No updates were shared on this day."
                : "The team is still brewing their coffee..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
