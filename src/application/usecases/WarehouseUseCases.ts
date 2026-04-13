import { WarehouseService } from '../../domain/services/WarehouseService';
import { Warehouse } from '../../domain/entities/Warehouse';

export class CreateWarehouseUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(input: { id: string; name: string; location: string; capacity: number }): Promise<Warehouse> {
    return this.warehouseService.createWarehouse(input.id, input.name, input.location, input.capacity);
  }
}

export class GetWarehouseUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(warehouseId: string): Promise<Warehouse> {
    return this.warehouseService.getWarehouse(warehouseId);
  }
}

export class ListWarehousesUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(): Promise<Warehouse[]> {
    return this.warehouseService.getAllWarehouses();
  }
}

export class UpdateWarehouseUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(warehouseId: string, input: { name: string; location: string; capacity: number }): Promise<Warehouse> {
    return this.warehouseService.updateWarehouse(warehouseId, input.name, input.location, input.capacity);
  }
}

export class DeleteWarehouseUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(warehouseId: string): Promise<void> {
    return this.warehouseService.deleteWarehouse(warehouseId);
  }
}

export class GetWarehouseCapacityUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(warehouseId: string): Promise<ReturnType<WarehouseService['getCapacityStatus']>> {
    return this.warehouseService.getCapacityStatus(warehouseId);
  }
}

export class CheckWarehouseCapacityUseCase {
  constructor(private warehouseService: WarehouseService) {}

  async execute(warehouseId: string, quantity: number): Promise<boolean> {
    return this.warehouseService.checkCapacity(warehouseId, quantity);
  }
}
