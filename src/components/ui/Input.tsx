import { forwardRef } from 'react';
import { clsx } from '../../utils/clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass';
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error, ...props }, ref) => {
    return (
      <input
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-white dark:bg-surface-800 border-gray-300 dark:border-surface-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-forest-500 focus:ring-forest-500': variant === 'default' && !error,
            'glass border-white/20 text-forest-700 dark:text-forest-300 placeholder-forest-500 dark:placeholder-forest-400 focus:border-forest-400 focus:ring-forest-400': variant === 'glass' && !error,
            // Error state
            'border-red-500 focus:border-red-500 focus:ring-red-500': error,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };