import AuthGuard from "@/components/AuthGuard";
import { getServerSession } from "@/lib/session";
import { getTeamBoardAction } from "@/actions/standups";
import { redirect } from "next/navigation";
import BoardClientUI from "./BoardClientUI"; // We'll move your UI here

export default async function TeamBoardPage() {
  const session = await getServerSession();

  // Redirect if not logged in or doesn't have a team yet
  if (!session) redirect("/login");
  if (!session.teamId) redirect("/onboarding");

  // Fetch the data on the server using the teamId from the session
  const { standups, date } = await getTeamBoardAction(session.teamId);

  return (
    <AuthGuard>
      <main className="p-6">
        {/* Pass the data down to your UI component */}
        <BoardClientUI initialStandups={standups} date={date} />
      </main>
    </AuthGuard>
  );
}
