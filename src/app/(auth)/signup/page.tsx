import { AuthShell } from '@/components/auth/AuthShell';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Start your secure WildJacket experience with email authentication.">
      <SignupForm />
    </AuthShell>
  );
}
