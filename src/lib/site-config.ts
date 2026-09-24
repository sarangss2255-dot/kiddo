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
