import AuthGuard from "@/components/AuthGuard";
import { getServerSession } from "@/lib/session";
import { getTeamBoardAction } from "@/actions/standups";
import { redirect } from "next/navigation";
import BoardClientUI from "./BoardClientUI"; // We'll move your UI here

interface TeamBoardPageProps {
  searchParams: Promise<{ teamId?: string }>;
}

export default async function TeamBoardPage({
  searchParams,
}: TeamBoardPageProps) {
  const { teamId } = await searchParams;
  const session = await getServerSession();

  // Redirect if not logged in or doesn't have a team yet
  if (!session) redirect("/login");
  const effectiveTeamId = teamId || session?.teamId;

  if (!effectiveTeamId) {
    redirect(session?.role === "admin" ? "/admin/dashboard" : "/onboarding");
  }

  // Fetch the data on the server using the teamId from the session
  const { standups, date, digest } = await getTeamBoardAction(effectiveTeamId);

  return (
    <AuthGuard>
      <main className="p-6">
        {/* Pass the data down to your UI component */}
        <BoardClientUI
          initialStandups={standups}
          date={date}
          teamId={effectiveTeamId}
          digest={digest}
        />
      </main>
    </AuthGuard>
  );
}
