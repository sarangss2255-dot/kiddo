import { BRAND_ASSETS, SITE_NAME } from '@/src/lib/site-config';
import { cn } from '@/src/lib/utils';

type BrandLogoProps = {
  /** `full` is the lockup with the wordmark; `mark` is the square app icon. */
  variant?: 'full' | 'mark';
  className?: string;
  alt?: string;
};

export function BrandLogo({ variant = 'full', className, alt = SITE_NAME }: BrandLogoProps) {
  return (
    <img
      src={variant === 'mark' ? BRAND_ASSETS.logoMark : BRAND_ASSETS.logo}
      alt={alt}
      draggable={false}
      className={cn('w-auto select-none', className)}
    />
  );
}
