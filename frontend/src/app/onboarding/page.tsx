import AuthGuard from "@/components/AuthGuard";
import OnboardingUI from "./OnboardingUI";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function TeamBoardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  if (session?.teamId) {
    redirect("/board"); // If they have a team, get them out of the waiting room!
  }
  return (
    <AuthGuard>
      <OnboardingUI />
    </AuthGuard>
  );
}
