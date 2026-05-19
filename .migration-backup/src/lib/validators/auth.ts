import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 12 characters'),
  confirmPassword: z.string().min(12, 'Confirm your new password'),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({ code: 'custom', message: 'Passwords must match', path: ['confirmPassword'] });
  }
});
