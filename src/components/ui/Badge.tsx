import { clsx } from '../../utils/clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'luxury';
  size?: 'sm' | 'md';
}

const Badge = ({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          // Variants
          'bg-gray-100 dark:bg-surface-700 text-gray-800 dark:text-gray-200': variant === 'default',
          'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200': variant === 'success',
          'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200': variant === 'warning',
          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200': variant === 'error',
          'luxury-gradient text-white': variant === 'luxury',
          // Sizes
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-0.5 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };