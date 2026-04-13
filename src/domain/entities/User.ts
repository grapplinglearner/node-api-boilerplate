import { UserRole } from '../types/auth';

export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public passwordHash: string,
    public name: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateUser();
  }

  private validateUser(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid email is required');
    }

    if (!this.name || this.name.trim() === '') {
      throw new Error('Name is required');
    }

    if (!this.passwordHash) {
      throw new Error('Password hash is required');
    }

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(this.role)) {
      throw new Error('Invalid role');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.SUPER_ADMIN;
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  isManager(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.MODERATOR;
  }

  canManageWarehouse(): boolean {
    return this.isAdmin() || this.isManager();
  }
}
