import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Enter your credentials to access secure WildJacket pages.">
      <LoginForm />
    </AuthShell>
  );
}
