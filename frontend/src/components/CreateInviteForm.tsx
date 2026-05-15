"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Link as LinkIcon, Copy, CheckCircle2 } from "lucide-react";
import { createInviteAction } from "@/actions/invites";
import { toast } from "sonner";
import { Input } from "./ui/input";

interface Team {
  _id: string;
  name: string;
}

interface CreateInviteFormProps {
  teams: Team[];
}

export default function CreateInviteForm({ teams }: CreateInviteFormProps) {
  const [teamId, setTeamId] = useState<string>("none");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);

    const finalTeamId = teamId === "none" ? undefined : teamId;
    const result = await createInviteAction({
      email: email,
      teamId: finalTeamId,
    });

    if (result.success) {
      setInviteLink(result.url);
      toast.success("Invite link generated!", { position: "bottom-center" });
    } else {
      toast.error(result.message || "Failed to generate invite", {
        position: "bottom-center",
      });
    }
    setLoading(false);
  }

  const handleValueChange = (value: string | null) => {
    setTeamId(value ?? "none");
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast.success("Copied to clipboard");
    }
  };

  if (inviteLink) {
    return (
      <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <div className="space-y-1">
          <p className="font-bold text-lg">Link Generated</p>
          <p className="text-sm text-muted-foreground">
            Share this with your team member
          </p>
        </div>

        <div className="w-full flex gap-2 mt-2">
          <code className="flex-1 p-2.5 bg-muted rounded text-xs truncate font-mono border">
            {inviteLink}
          </code>
          <Button size="icon" onClick={copyToClipboard} variant="secondary">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={() => setInviteLink(null)}
        >
          Generate another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-sm">
          Recipient Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
          disabled={loading}
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="team" className="text-sm">
          Target Team
        </Label>

        <Select disabled={loading} onValueChange={handleValueChange}>
          {/* w-full ensures the select stretches across the dialog */}
          <SelectTrigger value={teamId} className="h-12 w-full">
            <SelectValue placeholder="Select a team">
              {teamId === "none"
                ? "No Team (General Access)"
                : (teams.find((t) => t._id === teamId)?.name ??
                  "Select a team")}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none" className="text-muted-foreground">
              No Team (General Access)
            </SelectItem>
            {teams.map((team) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-[11px] text-muted-foreground px-1">
          {teamId === "none"
            ? "Users can join or create a team after signing up."
            : `Users will be automatically added to ${teams.find((t) => t._id === teamId)?.name || "the team"}.`}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-11 font-bold"
        disabled={loading || !email}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LinkIcon className="w-4 h-4 mr-2" />
        )}
        Generate Invite Link
      </Button>
    </form>
  );
}
