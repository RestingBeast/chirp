import { validateInviteAction } from "@/actions/auth";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

interface JoinPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold">Missing Invite Token</h1>
        <p className="text-muted-foreground mt-2">
          You need a valid invite link to register.
        </p>
        <Link href="/login" className="mt-4 text-primary underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const validation = await validateInviteAction(token);

  if (!validation.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Invalid Invite</h1>
        <p className="text-muted-foreground mt-2">{validation.message}</p>
        <Link href="/login" className="mt-4 text-primary underline">
          Back to Login
        </Link>
      </div>
    );
  }

  // If valid, we render the RegisterPage but pass the pre-filled email
  return <RegisterForm prefilledEmail={validation.email} inviteToken={token} />;
}
