"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeamAction } from "@/actions/teams";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateTeamFormProps {
  onSuccess?: () => void; // Add this prop
}

export default function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await createTeamAction(name);

    if (result.success) {
      toast.success("Team created successfully", { position: "bottom-center" });
      router.refresh();
      setName("");
    } else {
      toast.error(result.message || "Failed to create team", {
        position: "bottom-center",
      });
    }
    onSuccess?.();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-sm">
          Team Name
        </Label>
        <Input
          id="name"
          className="h-12"
          placeholder="e.g. Engineering Alpha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 font-bold"
        disabled={loading || !name}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Create Team
      </Button>
    </form>
  );
}
