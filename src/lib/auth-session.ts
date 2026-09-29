/**
 * Single source of truth for browser auth storage keys and session shapes.
 * Both the parent/child app area and the admin workspace read and write
 * sessions through these helpers so role-based routing stays consistent.
 */

export const AUTH_STORAGE_KEYS = {
  token: 'kiddo_token',
  user: 'kiddo_auth_user',
  role: 'kiddo_user_role',
  profile: 'kiddo_profile',
  adminToken: 'kiddo_admin_token',
  adminUser: 'kiddo_admin_user',
} as const;

export const ADMIN_ROLES = ['super_admin', 'manager', 'school_admin'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminSessionUser {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && (ADMIN_ROLES as readonly string[]).includes(role);
}

/** Persist an administrative session (web workspace only). */
export function saveAdminSession(accessToken: string, user: AdminSessionUser): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.adminToken, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.adminUser, JSON.stringify(user));
  // The shared API client authenticates with this token.
  localStorage.setItem(AUTH_STORAGE_KEYS.token, accessToken);
  // Never let a previous parent/child session leak into an admin session.
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  localStorage.removeItem(AUTH_STORAGE_KEYS.role);
  localStorage.removeItem(AUTH_STORAGE_KEYS.profile);
}

/** Persist a parent/teacher/child session for the app area. */
export function saveAppSession(accessToken: string, user: unknown, role: string): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.setItem(AUTH_STORAGE_KEYS.role, role);
  localStorage.removeItem(AUTH_STORAGE_KEYS.adminToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.adminUser);
}

export function clearAdminSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.adminToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.adminUser);
}

export function clearAppSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  localStorage.removeItem(AUTH_STORAGE_KEYS.role);
  localStorage.removeItem(AUTH_STORAGE_KEYS.profile);
}
