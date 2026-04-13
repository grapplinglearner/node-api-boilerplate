export interface IWarehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentUsage: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Warehouse {
  constructor(
    public id: string,
    public name: string,
    public location: string,
    public capacity: number,
    public currentUsage: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    this.validateWarehouse();
  }

  private validateWarehouse(): void {
    if (!this.name || this.name.trim() === '') {
      throw new Error('Warehouse name is required');
    }

    if (!this.location || this.location.trim() === '') {
      throw new Error('Warehouse location is required');
    }

    if (this.capacity <= 0) {
      throw new Error('Warehouse capacity must be positive');
    }

    if (this.currentUsage < 0 || this.currentUsage > this.capacity) {
      throw new Error('Current usage must be between 0 and capacity');
    }
  }

  getAvailableCapacity(): number {
    return this.capacity - this.currentUsage;
  }

  isCapacityAvailable(amount: number): boolean {
    return this.getAvailableCapacity() >= amount;
  }

  getCapacityPercentage(): number {
    return (this.currentUsage / this.capacity) * 100;
  }

  updateUsage(amount: number): void {
    const newUsage = this.currentUsage + amount;
    if (newUsage < 0 || newUsage > this.capacity) {
      throw new Error(`Cannot update usage to ${newUsage}. Must be between 0 and ${this.capacity}`);
    }
    this.currentUsage = newUsage;
    this.updatedAt = new Date();
  }
}
