import { UserRole, Permission } from '../types/auth';

export const RolePermissionMap: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.MANAGE_ADMINS,
    Permission.MANAGE_ROLES,
    Permission.MANAGE_PERMISSIONS,
    Permission.CREATE_MODERATORS,
    Permission.UPDATE_MODERATORS,
    Permission.CREATE_USERS,
    Permission.UPDATE_USERS,
    Permission.ASSIGN_PERMISSIONS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_PRODUCTS,
    Permission.READ_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.CREATE_WAREHOUSES,
    Permission.READ_WAREHOUSES,
    Permission.UPDATE_WAREHOUSES,
    Permission.DELETE_WAREHOUSES,
    Permission.CREATE_TRANSFERS,
    Permission.READ_TRANSFERS,
    Permission.UPDATE_TRANSFERS,
    Permission.DELETE_TRANSFERS,
  ],
  [UserRole.ADMIN]: [
    Permission.CREATE_MODERATORS,
    Permission.UPDATE_MODERATORS,
    Permission.CREATE_USERS,
    Permission.UPDATE_USERS,
    Permission.ASSIGN_PERMISSIONS,
    Permission.VIEW_REPORTS,
    Permission.CREATE_PRODUCTS,
    Permission.READ_PRODUCTS,
    Permission.UPDATE_PRODUCTS,
    Permission.DELETE_PRODUCTS,
    Permission.CREATE_WAREHOUSES,
    Permission.READ_WAREHOUSES,
    Permission.UPDATE_WAREHOUSES,
    Permission.DELETE_WAREHOUSES,
    Permission.CREATE_TRANSFERS,
    Permission.READ_TRANSFERS,
    Permission.UPDATE_TRANSFERS,
    Permission.DELETE_TRANSFERS,
  ],
  [UserRole.MODERATOR]: [
    Permission.VIEW_REPORTS,
    Permission.READ_PRODUCTS,
    Permission.READ_WAREHOUSES,
    Permission.READ_TRANSFERS,
    Permission.UPDATE_PRODUCTS,
    Permission.UPDATE_WAREHOUSES,
    Permission.UPDATE_TRANSFERS,
  ],
  [UserRole.USER]: [
    Permission.READ_PRODUCTS,
    Permission.READ_WAREHOUSES,
    Permission.READ_TRANSFERS,
  ],
};

export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};


export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = RolePermissionMap[role];
  return permissions.includes(permission);
}

export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  if (managerRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  if (managerRole === UserRole.ADMIN) {
    return targetRole === UserRole.MODERATOR || targetRole === UserRole.USER;
  }

  return false;
}

export function isRoleHigherOrEqual(role: UserRole, compareRole: UserRole): boolean {
  return RoleHierarchy[role] >= RoleHierarchy[compareRole];
}
