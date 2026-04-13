import { Warehouse } from '../entities/Warehouse';
import { IWarehouseRepository } from '../repositories/IRepository';

export class WarehouseService {
  constructor(private warehouseRepository: IWarehouseRepository) {}

  async createWarehouse(
    id: string,
    name: string,
    location: string,
    capacity: number
  ): Promise<Warehouse> {
    const warehouse = new Warehouse(id, name, location, capacity, 0, new Date(), new Date());
    return this.warehouseRepository.save(warehouse);
  }

  async getWarehouse(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) {
      throw new Error(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async getAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.findAll();
  }

  async updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = await this.getWarehouse(id);

    if (updates.name) warehouse.name = updates.name;
    if (updates.location) warehouse.location = updates.location;
    if (updates.capacity !== undefined && updates.capacity > 0) {
      warehouse.capacity = updates.capacity;
    }

    warehouse.updatedAt = new Date();
    return this.warehouseRepository.update(warehouse);
  }

  async deleteWarehouse(id: string): Promise<void> {
    await this.getWarehouse(id);
    return this.warehouseRepository.delete(id);
  }

  async checkCapacity(id: string, quantity: number): Promise<boolean> {
    const warehouse = await this.getWarehouse(id);
    return warehouse.isCapacityAvailable(quantity);
  }

  async getCapacityStatus(id: string): Promise<{
    capacity: number;
    currentUsage: number;
    availableCapacity: number;
    usagePercentage: number;
  }> {
    const warehouse = await this.getWarehouse(id);
    return {
      capacity: warehouse.capacity,
      currentUsage: warehouse.currentUsage,
      availableCapacity: warehouse.getAvailableCapacity(),
      usagePercentage: warehouse.getCapacityPercentage(),
    };
  }

  async addUsage(id: string, amount: number): Promise<Warehouse> {
    const warehouse = await this.getWarehouse(id);
    warehouse.updateUsage(amount);
    return this.warehouseRepository.update(warehouse);
  }

  async removeUsage(id: string, amount: number): Promise<Warehouse> {
    const warehouse = await this.getWarehouse(id);
    warehouse.updateUsage(-amount);
    return this.warehouseRepository.update(warehouse);
  }
}
