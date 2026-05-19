import { forwardRef } from 'react';
import { cn } from '../../utils/clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-xl transition-all duration-300 card-hover',
          {
            // Variants
            'bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-700 shadow-soft': variant === 'default',
            'glass-card': variant === 'glass',
            'bg-white dark:bg-surface-800 shadow-lg border border-gray-100 dark:border-surface-600': variant === 'elevated',
            // Padding
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };