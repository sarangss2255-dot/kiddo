export interface AuthUser {
  id: string;
  role: 'admin' | 'parent' | 'child';
  firstName: string;
  lastName: string;
  email?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
