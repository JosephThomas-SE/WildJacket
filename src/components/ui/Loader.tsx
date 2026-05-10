import { cn } from '../../utils/clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

const Loader = ({ size = 'md', variant = 'spinner', className }: LoaderProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (variant === 'spinner') {
    return (
      <svg
        className={cn('animate-spin text-forest-500', sizeClasses[size], className)}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        <div className={cn('bg-forest-500 rounded-full animate-bounce', sizeClasses[size])} />
        <div className={cn('bg-forest-500 rounded-full animate-bounce [animation-delay:0.1s]', sizeClasses[size])} />
        <div className={cn('bg-forest-500 rounded-full animate-bounce [animation-delay:0.2s]', sizeClasses[size])} />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('bg-forest-500 rounded-full animate-pulse', sizeClasses[size], className)} />
    );
  }

  return null;
};

export { Loader };