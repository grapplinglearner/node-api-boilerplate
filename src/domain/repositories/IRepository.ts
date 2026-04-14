import { Product } from '../entities/Product';
import { Warehouse } from '../entities/Warehouse';
import { InventoryTransfer } from '../entities/InventoryTransfer';
import { User } from '../entities/User';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findAllPaginated(skip: number, limit: number): Promise<Product[]>;
  count(): Promise<number>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  findByWarehouse(warehouseId: string): Promise<Product[]>;
}

export interface IWarehouseRepository {
  findById(id: string): Promise<Warehouse | null>;
  findAll(): Promise<Warehouse[]>;
  findAllPaginated(skip: number, limit: number): Promise<Warehouse[]>;
  count(): Promise<number>;
  save(warehouse: Warehouse): Promise<Warehouse>;
  update(warehouse: Warehouse): Promise<Warehouse>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}

export interface IInventoryTransferRepository {
  findById(id: string): Promise<InventoryTransfer | null>;
  findAll(): Promise<InventoryTransfer[]>;
  findAllPaginated(skip: number, limit: number): Promise<InventoryTransfer[]>;
  count(): Promise<number>;
  save(transfer: InventoryTransfer): Promise<InventoryTransfer>;
  update(transfer: InventoryTransfer): Promise<InventoryTransfer>;
  findByStatus(status: string): Promise<InventoryTransfer[]>;
  findByFromWarehouse(warehouseId: string): Promise<InventoryTransfer[]>;
  findByToWarehouse(warehouseId: string): Promise<InventoryTransfer[]>;
  softDelete(id: string): Promise<void>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findAllPaginated(skip: number, limit: number): Promise<User[]>;
  count(): Promise<number>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
