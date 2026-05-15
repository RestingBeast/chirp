import AuthGuard from "@/components/AuthGuard";
import { getServerSession } from "@/lib/session";
import { getTeamBoardAction } from "@/actions/standups";
import { getTeamMembersAction } from "@/actions/teams";
import { redirect } from "next/navigation";
import BoardClientUI from "./BoardClientUI"; // We'll move your UI here

interface TeamBoardPageProps {
  searchParams: Promise<{ teamId?: string; date?: string }>;
}

export default async function TeamBoardPage({
  searchParams,
}: TeamBoardPageProps) {
  const { teamId, date } = await searchParams;
  const session = await getServerSession();

  // Redirect if not logged in or doesn't have a team yet
  if (!session) redirect("/login");
  const effectiveTeamId = teamId || session?.teamId;

  if (!effectiveTeamId) {
    redirect(session?.role === "admin" ? "/admin/dashboard" : "/onboarding");
  }

  // Fetch the data on the server using the teamId from the session
  const {
    standups,
    date: fetchDate,
    digest,
  } = await getTeamBoardAction(effectiveTeamId, date);

  const { members } = await getTeamMembersAction(effectiveTeamId);
  return (
    <AuthGuard>
      <main className="p-6">
        {/* Pass the data down to your UI component */}
        <BoardClientUI
          initialStandups={standups}
          date={date ?? fetchDate}
          teamId={effectiveTeamId}
          digest={digest}
          members={members ?? []}
        />
      </main>
    </AuthGuard>
  );
}
