'use server';

import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from '@/lib/validators/auth';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function signupAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());

  const { fullName, email, password } =
    signupSchema.parse(formValues);

  const supabase =
    await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
      },

      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message:
      'Check your inbox for a confirmation email.',
  };
}

export async function loginAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());

  const { email, password } =
    loginSchema.parse(formValues);

  const supabase =
    await createSupabaseServerClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message: 'Login successful',
  };
}

export async function forgotPasswordAction(
  formData: FormData
) {
  const formValues =
    Object.fromEntries(formData.entries());

  const { email } =
    forgotPasswordSchema.parse(formValues);

  const supabase =
    await createSupabaseServerClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message:
      'Password reset email sent. Check your inbox.',
  };
}