export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum Permission {
  MANAGE_ADMINS = 'manage_admins',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',

  CREATE_MODERATORS = 'create_moderators',
  UPDATE_MODERATORS = 'update_moderators',
  CREATE_USERS = 'create_users',
  UPDATE_USERS = 'update_users',

  ASSIGN_PERMISSIONS = 'assign_permissions',
  VIEW_REPORTS = 'view_reports',

  CREATE_PRODUCTS = 'create_products',
  READ_PRODUCTS = 'read_products',
  UPDATE_PRODUCTS = 'update_products',
  DELETE_PRODUCTS = 'delete_products',

  CREATE_WAREHOUSES = 'create_warehouses',
  READ_WAREHOUSES = 'read_warehouses',
  UPDATE_WAREHOUSES = 'update_warehouses',
  DELETE_WAREHOUSES = 'delete_warehouses',

  CREATE_TRANSFERS = 'create_transfers',
  READ_TRANSFERS = 'read_transfers',
  UPDATE_TRANSFERS = 'update_transfers',
  DELETE_TRANSFERS = 'delete_transfers',
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  token: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  type: 'access' | 'refresh';
}
