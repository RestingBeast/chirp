"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Users, ArrowRight, ShieldCheck, Plus } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateTeamForm from "@/components/CreateTeamForm";
import CreateInviteForm from "@/components/CreateInviteForm";
import { useState } from "react";

interface Team {
  _id: string;
  name: string;
  adminId: {
    _id: string;
    email: string;
    name: string;
  };
  createdAt: string;
}

interface AdminDashboardProps {
  teams: Team[];
  success: boolean;
}

export default function AdminDashboard({
  teams,
  success,
}: AdminDashboardProps) {
  const [open, setOpen] = useState(false);
  return (
    <main className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-4 h-4" />
            Admin Console
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Organizations
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your teams and view their real-time standup performance.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Create Invite Dialog */}
          <Dialog>
            <DialogTrigger
              className="inline-flex items-center justify-center rounded-md 
                text-sm font-medium ring-offset-background transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 disabled:pointer-events-none 
                disabled:opacity-50 border border-input bg-background hover:bg-accent
                hover:text-accent-foreground px-4 h-8 shadow-sm"
            >
              <Users className="w-4 h-4 mr-2" />
              Create Invite
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>Generate Invite</DialogTitle>
                <DialogDescription>
                  Create a secure access link for a specific team.
                </DialogDescription>
              </DialogHeader>
              {/* Pass the teams fetched on the server to the client form */}
              <CreateInviteForm teams={teams} />
            </DialogContent>
          </Dialog>

          {/* Create Team Dialog */}
          <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
            <DialogTrigger
              className="inline-flex items-center justify-center rounded-md text-sm 
                font-medium ring-offset-background transition-colors focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50 bg-primary 
                text-primary-foreground hover:bg-primary/90 px-4 h-8 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Team
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>Create Team</DialogTitle>
                <DialogDescription>
                  Give your new team a name to start tracking standups.
                </DialogDescription>
              </DialogHeader>
              <CreateTeamForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {success && teams.length > 0 ? (
          teams.map((team: Team) => (
            <Card
              key={team._id}
              className="group hover:shadow-md transition-all border-l-0 hover:border-l-4 hover:border-l-primary"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                    <LayoutGrid className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    ID: {team._id.toString().slice(-4).toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-4">{team.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  Managed by {team.adminId.name}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Members viewable on board</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Link
                  href={`/board?teamId=${team._id}`}
                  className="w-full mt-4"
                >
                  <Button className="w-full group/btn" variant="secondary">
                    Go to Board
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground">
              You don't own any teams yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
