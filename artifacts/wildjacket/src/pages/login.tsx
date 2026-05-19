import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <AuthShell title="Sign in to WildJacket" subtitle="Enter your credentials to access your account">
        <LoginForm />
      </AuthShell>
    </div>
  );
}
