import { User } from '../entities/User';
import { Permission, UserRole } from '../types/auth';
import { RolePermissionMap, RoleHierarchy, hasPermission, canManageRole } from '../constants/roles';

export class AuthorizationService {

  hasPermission(user: User, permission: Permission): boolean {
    return hasPermission(user.role, permission);
  }

  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(user, permission));
  }


  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(user, permission));
  }


  canManageUser(manager: User, targetUser: User): boolean {
    return canManageRole(manager.role, targetUser.role);
  }


  canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
    return canManageRole(managerRole, targetRole);
  }


  getEffectivePermissions(user: User): Permission[] {
    return RolePermissionMap[user.role] || [];
  }

  roleHasPermission(role: UserRole, permission: Permission): boolean {
    return hasPermission(role, permission);
  }


  getRoleLevel(role: UserRole): number {
    return RoleHierarchy[role] || 0;
  }


  isRoleHigherOrEqual(role: UserRole, compareRole: UserRole): boolean {
    return this.getRoleLevel(role) >= this.getRoleLevel(compareRole);
  }


  isAdmin(user: User): boolean {
    return user.isAdmin();
  }


  isSuperAdmin(user: User): boolean {
    return user.isSuperAdmin();
  }


  isModerator(user: User): boolean {
    const level = this.getRoleLevel(user.role);
    return level >= this.getRoleLevel(UserRole.MODERATOR);
  }

  isRegularUser(user: User): boolean {
    return user.role === UserRole.USER;
  }
}
