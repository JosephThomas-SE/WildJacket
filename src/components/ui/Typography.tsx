import { cn } from '../../utils/clsx';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'lead' | 'caption' | 'luxury';
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const Typography = ({
  variant = 'p',
  as: Component = variant.startsWith('h') ? variant : 'p',
  className,
  children,
  ...props
}: TypographyProps) => {
  return (
    <Component
      className={cn(
        {
          'text-4xl font-bold tracking-tight text-luxury lg:text-5xl': variant === 'h1',
          'text-3xl font-semibold tracking-tight text-luxury': variant === 'h2',
          'text-2xl font-semibold tracking-tight text-luxury': variant === 'h3',
          'text-xl font-semibold tracking-tight text-eco': variant === 'h4',
          'text-lg font-semibold text-eco': variant === 'h5',
          'text-base font-semibold text-eco': variant === 'h6',
          'text-base leading-7': variant === 'p',
          'text-xl leading-8 text-muted-foreground': variant === 'lead',
          'text-sm text-muted-foreground': variant === 'caption',
          'text-2xl font-serif font-light tracking-wide text-luxury-gold': variant === 'luxury',
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Typography };