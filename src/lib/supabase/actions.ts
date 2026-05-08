'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { forgotPasswordSchema, loginSchema, signupSchema } from '@/lib/validators/auth';

function getActionClient() {
  return createServerActionClient<Database>({ cookies });
}

export async function signupAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { fullName, email, password } = signupSchema.parse(formValues);

  const supabase = getActionClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return 'Check your inbox for a confirmation email.';
}

export async function loginAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { email, password } = loginSchema.parse(formValues);

  const supabase = getActionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return 'Login successful';
}

export async function forgotPasswordAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { email } = forgotPasswordSchema.parse(formValues);
  const supabase = getActionClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return 'Password reset email sent. Check your inbox.';
}
