"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { submitStandupAction } from "@/actions/standups";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function StandupForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const onTriggerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmOpen(true); // Open the dialog instead of submitting immediately
  };

  const [fields, setFields] = useState({
    yesterday: "",
    today: "",
    blockers: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const MAX_CHARS = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setFields({ ...fields, [e.target.name]: e.target.value });
    }
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleFinalSubmit = async () => {
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
      if (result.errors) {
        const errors = Object.fromEntries(
          result.errors.map((e: any) => [e.field, e.message]),
        );
        setFieldErrors(errors);
      }
      toast.error(result.message, { position: "top-center" });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Daily Standup (
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            )
          </CardTitle>
          <CardDescription>Keep it brief, keep it useful.</CardDescription>
        </CardHeader>
        <form onSubmit={onTriggerSubmit}>
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
              {fieldErrors.yesterday && (
                <p className="text-xs text-destructive">
                  {fieldErrors.yesterday}
                </p>
              )}
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
              {fieldErrors.today && (
                <p className="text-xs text-destructive">{fieldErrors.today}</p>
              )}
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
              {fieldErrors.blockers && (
                <p className="text-xs text-destructive">
                  {fieldErrors.blockers}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <AlertDialogTrigger
                type="submit"
                disabled={isLoading || !fields.yesterday || !fields.today}
                className="w-full inline-flex items-center justify-center gap-2 h-11 
                  rounded-md bg-primary text-primary-foreground font-medium text-sm 
                  shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50
                  disabled:pointer-events-none"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Standup
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Standups cannot be edited or deleted once recorded. Ensure
                    your update is accurate.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleFinalSubmit}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Confirm & Post
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
