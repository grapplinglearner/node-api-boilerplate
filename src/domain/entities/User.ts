export interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'warehouse_manager' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public passwordHash: string,
    public name: string,
    public role: 'admin' | 'warehouse_manager' | 'staff',
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

    if (!['admin', 'warehouse_manager', 'staff'].includes(this.role)) {
      throw new Error('Invalid role');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isManager(): boolean {
    return this.role === 'warehouse_manager';
  }

  canManageWarehouse(): boolean {
    return this.isAdmin() || this.isManager();
  }
}
