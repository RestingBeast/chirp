"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { assignUserAction } from "@/actions/teams";
import { toast } from "sonner";
import { Team } from "@/types/team.types";
import { User } from "@/types/user.types";

interface AssignUserFormProps {
  users: User[];
  teams: Team[];
  onSuccess?: () => void;
}

export default function AssignUserForm({
  users,
  teams,
  onSuccess,
}: AssignUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUser || !selectedTeam) return;

    setLoading(true);
    const result = await assignUserAction({
      userId: selectedUser,
      teamId: selectedTeam,
    });

    if (result.success) {
      toast.success("User assigned successfully", {
        position: "bottom-center",
      });
      if (onSuccess) onSuccess();
    } else {
      toast.error(result.message || "Failed to assign user", {
        position: "bottom-center",
      });
    }
    setLoading(false);
  }
  console.log(users);
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {/* Searchable User Selection */}
      <div className="space-y-3 flex flex-col">
        <Label className="text-sm">Search User</Label>
        <Popover open={openUser} onOpenChange={setOpenUser}>
          <PopoverTrigger
            className={cn(
              "w-full h-12 flex items-center justify-between px-3 font-normal border rounded-md bg-background text-sm",
              !selectedUser && "text-muted-foreground",
            )}
            disabled={loading}
          >
            {selectedUser
              ? users.find((u) => u._id === selectedUser)?.name
              : "Select user..."}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command className="w-80">
              <CommandInput placeholder="Search users..." />
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user._id}
                    value={user._id}
                    keywords={[user.name]}
                    onSelect={() => {
                      setSelectedUser(user._id);
                      setOpenUser(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUser === user._id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email} -{" "}
                        {user.teamId?._id
                          ? `${user.teamId?.name}`
                          : "No Assignment"}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Searchable Team Selection */}
      <div className="space-y-3 flex flex-col">
        <Label className="text-sm">Target Team</Label>
        <Popover open={openTeam} onOpenChange={setOpenTeam}>
          <PopoverTrigger
            className={cn(
              "w-full h-12 flex items-center justify-between px-3 font-normal border rounded-md bg-background text-sm",
              !selectedTeam && "text-muted-foreground",
            )}
            disabled={loading}
          >
            {selectedTeam
              ? teams.find((t) => t._id === selectedTeam)?.name
              : "Select team..."}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command className="w-80">
              <CommandInput placeholder="Search teams..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup>
                {teams.map((team, i) => (
                  <CommandItem
                    key={team._id}
                    value={team._id}
                    keywords={[team.name]}
                    onSelect={() => {
                      setSelectedTeam(team._id);
                      setOpenTeam(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTeam === team._id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {team.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        className="w-full h-11 font-bold"
        disabled={loading || !selectedUser || !selectedTeam}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4 mr-2" />
        )}
        Assign User to Team
      </Button>
    </form>
  );
}
