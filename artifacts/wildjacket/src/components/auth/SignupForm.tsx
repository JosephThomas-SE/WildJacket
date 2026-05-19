import { type FormEvent, useState, useTransition } from "react";
import { useLocation } from "wouter";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";
import { supabaseBrowser } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validators/auth";

export function SignupForm() {
  const [formState, setFormState] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [isPending, startTransition] = useTransition();
  const [, navigate] = useLocation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      signupSchema.parse(formState);
      startTransition(async () => {
        try {
          const { error } = await supabaseBrowser.auth.signUp({
            email: formState.email,
            password: formState.password,
            options: {
              data: { full_name: formState.fullName },
              emailRedirectTo: `${window.location.origin}/login`,
            },
          });
          if (error) throw new Error(error.message);
          toast.success("Signup successful. Check your email.");
          navigate("/login");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to create account";
          toast.error(message);
        }
      });
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setErrors({
          fullName: validationError.formErrors.fieldErrors?.fullName?.[0],
          email: validationError.formErrors.fieldErrors?.email?.[0],
          password: validationError.formErrors.fieldErrors?.password?.[0],
        });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Full name</span>
        <input
          name="fullName"
          value={formState.fullName}
          onChange={(event) => setFormState({ ...formState, fullName: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
        />
        {errors.fullName ? <p className="mt-2 text-sm text-rose-400">{errors.fullName}</p> : null}
      </label>

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
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
