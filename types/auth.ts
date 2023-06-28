export interface IntUserLoginData {
  email: string;
  password: string;
}

export type Role = 'BASIC' | 'ADMIN';

export enum RoleEnum {
  BASIC = 'BASIC',
  ADMIN = 'ADMIN'
}

export interface IntUser {
  id: number;
  created_at: Date;
  updated_at: Date;
  email: string;
  role: Role;
  deleted_at: Date | null;
  token: string;
  firstName: string;
  lastName: string;
}
