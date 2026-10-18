import appReleases from './app-releases.json';

const FALLBACK_SITE_URL = 'https://kiddoapp.in';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, '');

export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return FALLBACK_SITE_URL.replace(/^https?:\/\//, '');
  }
})();

export const CHILD_APP_APK_URL =
  process.env.NEXT_PUBLIC_CHILD_APP_APK_URL ?? '/kiddo-child-app.apk';

export const PARENT_APP_APK_URL =
  process.env.NEXT_PUBLIC_PARENT_APP_APK_URL ?? '/kiddo-parent-app.apk';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'KidDo';

export type AppRelease = {
  label: string;
  version: string;
  buildNumber: number;
  /** ISO date (YYYY-MM-DD) of the packaged APK. */
  buildDate: string;
  sizeBytes: number;
  publicFile: string;
};

const releases = appReleases as Record<'child' | 'parent', AppRelease>;

export const CHILD_APP_RELEASE = releases.child;
export const PARENT_APP_RELEASE = releases.parent;

/** "Mar 4, 2026" — deterministic so server and client markup match. */
export function formatReleaseDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "72.0 MB" — null when the size is unknown. */
export function formatReleaseSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** "v1.0.0 · Updated Mar 4, 2026 · 72.0 MB" */
export function formatReleaseMeta(release: AppRelease) {
  const size = formatReleaseSize(release.sizeBytes);
  return [
    `v${release.version}`,
    `Updated ${formatReleaseDate(release.buildDate)}`,
    size,
  ]
    .filter(Boolean)
    .join(' · ');
}
