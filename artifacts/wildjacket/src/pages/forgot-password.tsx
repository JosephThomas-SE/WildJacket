import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
        <ForgotPasswordForm />
      </AuthShell>
    </div>
  );
}
