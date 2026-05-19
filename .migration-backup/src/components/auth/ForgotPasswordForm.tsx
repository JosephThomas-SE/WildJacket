'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ZodError } from 'zod';
import { forgotPasswordAction } from '@/lib/supabase/actions';
import { forgotPasswordSchema } from '@/lib/validators/auth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      forgotPasswordSchema.parse({ email });
      startTransition(async () => {
        try {
          await forgotPasswordAction(new FormData(event.currentTarget));
          toast.success('Password reset email sent');
          router.push('/login');
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to send reset email';
          setErrorMessage(message);
          toast.error(message);
        }
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setErrorMessage(validationError.formErrors.fieldErrors?.email?.[0] ?? 'Enter a valid email');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Email</span>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
      </label>
      {errorMessage ? <p className="text-sm text-rose-400">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending reset link…' : 'Send reset link'}
      </button>
    </form>
  );
}
