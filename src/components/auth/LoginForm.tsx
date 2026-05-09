'use client';

import { type FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ZodError } from 'zod';
import { loginAction } from '@/lib/supabase/actions';
import { loginSchema } from '@/lib/validators/auth';

export function LoginForm() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      loginSchema.parse(formState);
      startTransition(async () => {
        try {
          await loginAction(new FormData(event.currentTarget));
          toast.success('Signed in successfully');
          router.push('/dashboard');
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to sign in';
          toast.error(message);
        }
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setErrors({
          email: validationError.formErrors.fieldErrors?.email?.[0],
          password: validationError.formErrors.fieldErrors?.password?.[0],
        });
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
          value={formState.email}
          onChange={(event) => setFormState({ ...formState, email: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
        {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email}</p> : null}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-200">Password</span>
        <input
          name="password"
          type="password"
          value={formState.password}
          onChange={(event) => setFormState({ ...formState, password: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
        {errors.password ? <p className="mt-2 text-sm text-rose-400">{errors.password}</p> : null}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
