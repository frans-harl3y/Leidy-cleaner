export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}
