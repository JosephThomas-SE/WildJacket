import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <AuthShell title="Set new password" subtitle="Choose a strong password for your account">
        <ResetPasswordForm />
      </AuthShell>
    </div>
  );
}
