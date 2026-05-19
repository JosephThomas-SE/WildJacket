import { type FormEvent, useEffect, useState, useTransition } from "react";
import { useLocation } from "wouter";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import { supabaseBrowser } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validators/auth";

export function ResetPasswordForm() {
  const [formState, setFormState] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [ready, setReady] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access_token")) {
      setReady(true);
    }
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      setReady(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      resetPasswordSchema.parse(formState);
      startTransition(async () => {
        try {
          const { error } = await supabaseBrowser.auth.updateUser({ password: formState.password });
          if (error) throw error;
          toast.success("Password has been reset successfully");
          navigate("/login");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to reset password";
          toast.error(message);
        }
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setErrors({
          password: validationError.formErrors.fieldErrors?.password?.[0],
          confirmPassword: validationError.formErrors.fieldErrors?.confirmPassword?.[0],
        });
      }
    }
  }

  if (!ready) {
    return <p className="text-center text-slate-300">Waiting for a secure reset token.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">New password</span>
        <input
          name="password"
          type="password"
          value={formState.password}
          onChange={(event) => setFormState({ ...formState, password: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
        {errors.password ? <p className="mt-2 text-sm text-rose-400">{errors.password}</p> : null}
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-200">Confirm password</span>
        <input
          name="confirmPassword"
          type="password"
          value={formState.confirmPassword}
          onChange={(event) => setFormState({ ...formState, confirmPassword: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
        {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-400">{errors.confirmPassword}</p> : null}
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Resetting password…" : "Reset password"}
      </button>
    </form>
  );
}
