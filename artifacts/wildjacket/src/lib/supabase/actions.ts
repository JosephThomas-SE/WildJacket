import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from "@/lib/validators/auth";
import { supabaseBrowser } from "@/lib/supabase/client";

export async function signupAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { fullName, email, password } = signupSchema.parse(formValues);

  const { error } = await supabaseBrowser.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: "Check your inbox for a confirmation email.",
  };
}

export async function loginAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { email, password } = loginSchema.parse(formValues);

  const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);

  return { success: true, message: "Login successful" };
}

export async function forgotPasswordAction(formData: FormData) {
  const formValues = Object.fromEntries(formData.entries());
  const { email } = forgotPasswordSchema.parse(formValues);

  const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw new Error(error.message);

  return {
    success: true,
    message: "Password reset email sent. Check your inbox.",
  };
}
