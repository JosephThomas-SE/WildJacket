import { forwardRef } from 'react';
import { cn } from '../../utils/clsx';

interface SectionLayoutProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'hero' | 'feature' | 'cta';
  container?: boolean;
  className?: string;
}

const SectionLayout = forwardRef<HTMLElement, SectionLayoutProps>(
  ({ className, variant = 'default', container = true, children, ...props }, ref) => {
    return (
      <section
        className={cn(
          'py-16 lg:py-24',
          {
            // Variants
            '': variant === 'default',
            'min-h-screen flex items-center eco-gradient text-white': variant === 'hero',
            'bg-earth-50 dark:bg-earth-900/20': variant === 'feature',
            'luxury-gradient text-white': variant === 'cta',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {container ? (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        ) : (
          children
        )}
      </section>
    );
  }
);

SectionLayout.displayName = 'SectionLayout';

export { SectionLayout };