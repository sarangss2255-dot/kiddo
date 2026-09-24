export interface AuthUser {
  id: string;
  role: 'super_admin' | 'manager' | 'school_admin' | 'parent' | 'child';
  firstName: string;
  lastName: string;
  email?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
