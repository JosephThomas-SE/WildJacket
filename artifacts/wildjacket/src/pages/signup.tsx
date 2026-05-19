import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <AuthShell title="Create your account" subtitle="Join WildJacket for premium eco-tourism experiences">
        <SignupForm />
      </AuthShell>
    </div>
  );
}
