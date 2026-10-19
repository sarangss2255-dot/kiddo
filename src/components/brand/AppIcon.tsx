import { BRAND_ASSETS, SITE_NAME } from '@/src/lib/site-config';
import { cn } from '@/src/lib/utils';

type AppIconProps = {
  app: 'child' | 'parent';
  className?: string;
  alt?: string;
};

const APP_ICON_SRC = {
  child: BRAND_ASSETS.childAppIcon,
  parent: BRAND_ASSETS.parentAppIcon,
} as const;

export function AppIcon({ app, className, alt }: AppIconProps) {
  return (
    <img
      src={APP_ICON_SRC[app]}
      alt={alt ?? `${SITE_NAME} ${app} app icon`}
      draggable={false}
      className={cn('object-contain select-none', className)}
    />
  );
}
