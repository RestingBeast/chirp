"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { User } from "@/types/user.types";

const PAGE_SIZE = 10;

const MOCK_USERS: User[] = [
  {
    _id: "665a1b2c3d4e5f6a7b8c9d01",
    email: "admin@test.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d02",
    email: "sarah@test.com",
    name: "Sarah Chen",
    role: "admin",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d03",
    email: "alex@test.com",
    name: "Alex Johnson",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d04",
    email: "maria@test.com",
    name: "Maria Garcia",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-01-20T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d05",
    email: "james@test.com",
    name: "James Wilson",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a02", name: "Design" },
    createdAt: "2025-02-01T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d06",
    email: "emily@test.com",
    name: "Emily Brown",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a02", name: "Design" },
    createdAt: "2025-02-05T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d07",
    email: "david@test.com",
    name: "David Kim",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-02-10T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d08",
    email: "lisa@test.com",
    name: "Lisa Anderson",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a03", name: "Marketing" },
    createdAt: "2025-02-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d09",
    email: "michael@test.com",
    name: "Michael Taylor",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d10",
    email: "jennifer@test.com",
    name: "Jennifer Martinez",
    role: "member",
    createdAt: "2025-03-05T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d11",
    email: "robert@test.com",
    name: "Robert Lee",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a03", name: "Marketing" },
    createdAt: "2025-03-10T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d12",
    email: "amanda@test.com",
    name: "Amanda White",
    role: "member",
    createdAt: "2025-03-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d13",
    email: "thomas@test.com",
    name: "Thomas Jackson",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a02", name: "Design" },
    createdAt: "2025-03-20T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d14",
    email: "jessica@test.com",
    name: "Jessica Thomas",
    role: "member",
    createdAt: "2025-04-01T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d15",
    email: "christopher@test.com",
    name: "Christopher Harris",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-04-05T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d16",
    email: "michelle@test.com",
    name: "Michelle Clark",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a03", name: "Marketing" },
    createdAt: "2025-04-10T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d17",
    email: "daniel@test.com",
    name: "Daniel Lewis",
    role: "member",
    createdAt: "2025-04-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d18",
    email: "patricia@test.com",
    name: "Patricia Robinson",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a02", name: "Design" },
    createdAt: "2025-04-20T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d19",
    email: "kevin@test.com",
    name: "Kevin Walker",
    role: "member",
    createdAt: "2025-05-01T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d20",
    email: "nancy@test.com",
    name: "Nancy Hall",
    role: "member",
    createdAt: "2025-05-05T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d21",
    email: "brian@test.com",
    name: "Brian Allen",
    role: "member",
    teamId: { _id: "665a1b2c3d4e5f6a7b8c9a01", name: "Engineering" },
    createdAt: "2025-05-10T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d22",
    email: "betty@test.com",
    name: "Betty Young",
    role: "member",
    createdAt: "2025-05-15T08:00:00Z",
  },
  {
    _id: "665a1b2c3d4e5f6a7b8c9d23",
    email: "helen@test.com",
    name: "Helen Wright",
    role: "member",
    createdAt: "2025-05-20T08:00:00Z",
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "member">("member");

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = useMemo(
    () => users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [users, currentPage],
  );

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
  };

  const handleSave = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u._id === editingUser._id
          ? { ...u, name: editName, role: editRole }
          : u,
      ),
    );
    setEditingUser(null);
    toast.success("User updated", { position: "bottom-center" });
  };

  const handleDelete = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u._id !== deletingUser._id));
    const newTotal = users.length - 1;
    const maxPage = Math.ceil(newTotal / PAGE_SIZE);
    if (currentPage > maxPage) setCurrentPage(maxPage);
    setDeletingUser(null);
    toast.success("User deleted", { position: "bottom-center" });
  };

  const startItem = Math.min((currentPage - 1) * PAGE_SIZE + 1, users.length);
  const endItem = Math.min(currentPage * PAGE_SIZE, users.length);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-xs">
          <ShieldCheck className="w-4 h-4" />
          User Management
        </div>
        <p className="text-sm text-muted-foreground">
          <Users className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          {users.length} total users
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="h-10 px-4 text-left align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Team
                </th>
                <th className="h-10 px-4 text-right align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle font-medium">{user.name}</td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {user.teamId ? (
                      <Badge variant="outline">{user.teamId.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit {user.name}</span>
                      </Button>
                      {!user.teamId ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingUser(user)}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete {user.name}</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled
                          className="opacity-30"
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete {user.name}</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startItem}&ndash;{endItem} of {users.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-3.5 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="xs"
                className="min-w-7"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRight className="size-3.5 ml-1" />
          </Button>
        </div>
      </div>

      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Email cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <Separator className="-mx-4 w-auto" />
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="User name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={editingUser?.email ?? ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editRole}
                onValueChange={(v: "admin" | "member") => setEditRole(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deletingUser?.name}
              </span>
              ? This action cannot be undone and the user will lose access to
              the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
